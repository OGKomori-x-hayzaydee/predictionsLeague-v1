# Blueprint: Unified Profile Avatar Upload System

## 1. Problem Statement

Users currently have no way to change their profile picture in the app. There are three specific issues:

1. **OAuth (Google) users** get their Google profile picture captured at registration, but it is **never refreshed** on subsequent logins. If a user changes their Google profile picture, the app still shows the old one.
2. **Email/password users** have no profile picture at all — the UI just shows their initial letter.
3. **No upload UI exists** — the backend S3 upload infrastructure is partially built but has endpoint mismatches with the frontend, and there is zero frontend UI to trigger uploads.

### Current Architecture (What Exists)

| Layer | What Exists | Issues |
|-------|------------|--------|
| **Database** | `profile_picture_url VARCHAR(255)` on `users` table | Single field stores both Google CDN URLs and S3 URLs indiscriminately — no way to distinguish source |
| **Backend Upload** | `POST /profile/upload` endpoint + S3 upload logic in `ProfileService` | Frontend calls `/profile/picture` (wrong URL). Form field name mismatch (`profilePicture` vs `file`) |
| **Backend Delete** | No endpoint exists | Frontend expects `DELETE /users/profile/picture` — completely missing |
| **OAuth Flow** | Captures Google picture at registration only (`OAuth2Controller:56-63`) | Never refreshes on subsequent logins (`OAuth2Controller:73-78`) |
| **Frontend API** | `uploadProfilePicture()` and `deleteProfilePicture()` methods in `userAPI.js` | 3 bugs: wrong URL, wrong form field name, wrong response field parsing |
| **Frontend UI** | `ProfileHero.jsx` displays avatar (picture or initials) | No upload trigger, no hover overlay, no file picker, no remove button |

---

## 2. Architectural Design

### 2.1 Key Decision: Separate `oauthPictureUrl` Column

The core design choice is adding a new `oauth_picture_url` column to the `users` table. This separates the **active displayed picture** from the **OAuth-provided picture**, enabling clean fallback logic.

```
┌─────────────────────────────────────────────────────────────────┐
│                        UserEntity                               │
├─────────────────────────────────────────────────────────────────┤
│ profilePictureUrl  │ The ACTIVE picture shown in UI             │
│                    │ (S3 URL, Google URL, or null)              │
├────────────────────┼────────────────────────────────────────────┤
│ oauthPictureUrl    │ The Google CDN URL, updated every          │
│                    │ OAuth login. Never shown directly —        │
│                    │ only used as a fallback.                   │
└────────────────────┴────────────────────────────────────────────┘
```

### 2.2 State Machine: Profile Picture Lifecycle

```
                    ┌──────────────────┐
                    │   No Picture     │
                    │ (email/pw user)  │
                    │ profilePic=null  │
                    └────────┬─────────┘
                             │ upload
                             ▼
                    ┌──────────────────┐
         upload     │  Custom Picture  │  upload
        ┌──────────▶│ profilePic=S3    │◀──────────┐
        │           └────────┬─────────┘           │
        │                    │ delete               │
        │                    ▼                      │
┌───────┴──────────┐                      ┌────────┴─────────┐
│   No Picture     │                      │  Google Picture   │
│ (email/pw user)  │                      │ (OAuth user)      │
│ profilePic=null  │                      │ profilePic=oauth  │
└──────────────────┘                      └──────────────────┘
                                                   │
                                          OAuth re-login refreshes
                                          oauthPictureUrl always
```

### 2.3 Logic Rules

| Action | `profilePictureUrl` | `oauthPictureUrl` |
|--------|--------------------|--------------------|
| **OAuth registration** | = Google picture | = Google picture |
| **Email/pw registration** | = null | = null |
| **Upload custom picture** | = new S3 URL | unchanged |
| **Delete custom (OAuth user)** | = copy of `oauthPictureUrl` | unchanged |
| **Delete custom (email user)** | = null | unchanged (still null) |
| **OAuth re-login (no custom pic)** | = new Google URL | = new Google URL |
| **OAuth re-login (has custom pic)** | unchanged (keeps S3 URL) | = new Google URL |

---

## 3. Backend Implementation

### 3.1 Database Migration

**New file:** `predictions-backend/src/main/resources/db/migration/V21__add_oauth_picture_url.sql`

```sql
-- Add dedicated column for OAuth-provided profile picture URL.
-- VARCHAR(500) because Google CDN URLs can exceed 255 characters
-- with size parameters and path components.
ALTER TABLE users ADD COLUMN oauth_picture_url VARCHAR(500);

-- Backfill existing OAuth users.
-- If their current profile_picture_url is a Google URL, copy it
-- to oauth_picture_url so we know what to fall back to.
UPDATE users
SET oauth_picture_url = profile_picture_url
WHERE profile_picture_url IS NOT NULL
  AND profile_picture_url LIKE '%googleusercontent.com%';
```

### 3.2 Entity Change

**File:** `predictions-backend/src/main/java/com/komori/predictions/entity/UserEntity.java`

Add one field after `profilePictureUrl` (line 30):

```java
private String profilePictureUrl;
@Column(length = 500)
private String oauthPictureUrl;       // <-- NEW
private Boolean accountVerified;
```

### 3.3 Profile Service Changes

**File:** `predictions-backend/src/main/java/com/komori/predictions/service/ProfileService.java`

#### 3.3.1 Add validation to `setProfilePicture()` (modify existing method, lines 117-132)

Insert validation before the existing S3 upload logic. Also add old-picture cleanup:

```java
public String setProfilePicture(MultipartFile file, String email) throws IOException {
    // ── Validation ──
    if (file.isEmpty()) {
        throw new IllegalArgumentException("File cannot be empty");
    }
    if (file.getSize() > 5 * 1024 * 1024) {
        throw new IllegalArgumentException("File size must not exceed 5MB");
    }
    String contentType = file.getContentType();
    if (contentType == null || !Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    ).contains(contentType)) {
        throw new IllegalArgumentException("Only JPG, PNG, GIF, and WEBP formats are allowed");
    }

    UserEntity currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

    // ── Clean up old S3 picture if applicable ──
    deleteOldS3Picture(currentUser);

    // ── Upload to S3 (existing logic) ──
    String key = "profile-pictures/" + currentUser.getUUID() + "/"
               + UUID.randomUUID() + "-" + file.getOriginalFilename();
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentLength(file.getSize());
    metadata.setContentType(file.getContentType());

    amazonS3.putObject(new PutObjectRequest(bucketName, key, file.getInputStream(), metadata)
            .withCannedAcl(CannedAccessControlList.PublicRead));
    String url = amazonS3.getUrl(bucketName, key).toString();
    currentUser.setProfilePictureUrl(url);
    userRepository.save(currentUser);
    return url;
}
```

#### 3.3.2 Add new `deleteProfilePicture()` method

```java
public String deleteProfilePicture(String email) {
    UserEntity currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

    deleteOldS3Picture(currentUser);

    // Fall back to OAuth picture if available, otherwise null (shows initials)
    String fallbackUrl = currentUser.getOauthPictureUrl();
    currentUser.setProfilePictureUrl(fallbackUrl);
    userRepository.save(currentUser);
    return fallbackUrl; // null for email users, Google URL for OAuth users
}
```

#### 3.3.3 Add private `deleteOldS3Picture()` helper

```java
private void deleteOldS3Picture(UserEntity user) {
    String currentUrl = user.getProfilePictureUrl();
    // Only delete if it's an S3 URL (contains our bucket name), not a Google URL
    if (currentUrl != null && currentUrl.contains(bucketName)) {
        try {
            String key = currentUrl.substring(
                currentUrl.indexOf(bucketName) + bucketName.length() + 1
            );
            amazonS3.deleteObject(bucketName, key);
        } catch (Exception e) {
            // Best-effort cleanup — log but don't fail the operation
            // Old objects can be cleaned up with S3 lifecycle policy
        }
    }
}
```

**Add import:** `java.util.Set` (for the validation)

### 3.4 Profile Controller Changes

**File:** `predictions-backend/src/main/java/com/komori/predictions/controller/ProfileController.java`

#### 3.4.1 Rename upload endpoint (line 61)

```java
// BEFORE:
@PostMapping("/upload")

// AFTER:
@PostMapping("/picture")
```

This makes the URL `POST /profile/picture`, matching what the frontend already calls.

#### 3.4.2 Add delete endpoint (new method after line 66)

```java
@DeleteMapping("/picture")
public ResponseEntity<?> deleteProfilePicture(
        @CurrentSecurityContext(expression = "authentication?.name") String email) {
    String fallbackUrl = profileService.deleteProfilePicture(email);
    return ResponseEntity.ok(Map.of(
        "url", fallbackUrl != null ? fallbackUrl : "",
        "deleted", true
    ));
}
```

### 3.5 OAuth2 Controller Changes

**File:** `predictions-backend/src/main/java/com/komori/predictions/controller/OAuth2Controller.java`

#### 3.5.1 Registration (lines 58-65) — set both fields

```java
UserEntity newUser = UserEntity.builder()
        .UUID(UUID.randomUUID().toString())
        .email(email)
        .firstName(firstName)
        .lastName(lastName)
        .profilePictureUrl(picture)
        .oauthPictureUrl(picture)       // <-- NEW: store Google URL separately
        .accountVerified(true)
        .build();
```

#### 3.5.2 Returning user login (lines 73-78) — add Google picture refresh

Replace the simple `else` block with:

```java
} else { // User Login
    UserEntity existingUser = user.get();

    // Refresh Google profile picture on every OAuth login
    HttpHeaders header = new HttpHeaders();
    header.setBearerAuth(accessToken);
    HttpEntity<Void> httpEntity = new HttpEntity<>(header);
    try {
        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                "https://openidconnect.googleapis.com/v1/userinfo",
                HttpMethod.GET, httpEntity, Map.class);
        Map<String, Object> userInfo = responseEntity.getBody();
        if (userInfo != null) {
            String newPicture = (String) userInfo.get("picture");
            if (newPicture != null) {
                String oldOauthPicture = existingUser.getOauthPictureUrl();
                existingUser.setOauthPictureUrl(newPicture);

                // Only update active picture if user hasn't set a custom one
                if (existingUser.getProfilePictureUrl() == null
                        || existingUser.getProfilePictureUrl().equals(oldOauthPicture)) {
                    existingUser.setProfilePictureUrl(newPicture);
                }
                userRepository.save(existingUser);
            }
        }
    } catch (Exception e) {
        // Don't block login if picture refresh fails
    }

    ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(email);
    ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(email);
    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    response.sendRedirect(frontendUrl + "/auth/callback?destination=dashboard");
}
```

#### 3.5.3 Incomplete registration (line 70-72) — same refresh

Apply the same Google picture refresh logic for users with incomplete registration (no favourite team or username yet).

### 3.6 Application Configuration

**File:** `predictions-backend/src/main/resources/application.yaml`

Add under the existing `spring:` section:

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 5MB
```

Spring Boot's default max file size is 1MB — this raises it to 5MB.

### 3.7 ProfileOverview DTO

**File:** `predictions-backend/src/main/java/com/komori/predictions/dto/response/ProfileOverview.java`

Add a field so the frontend knows whether a "Remove" should fall back to a Google picture or to initials:

```java
private boolean hasOauthPicture;    // <-- NEW field

public ProfileOverview(UserEntity entity) {
    // ... existing mappings ...
    this.hasOauthPicture = entity.getOauthPictureUrl() != null;   // <-- NEW
}
```

---

## 4. Frontend Implementation

### 4.1 Fix API Service

**File:** `predictions-frontend/src/services/api/userAPI.js`

#### 4.1.1 Fix `uploadProfilePicture()` (lines 79-106)

Three bugs to fix:

```javascript
async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);           // BUG FIX: was 'profilePicture'

      const response = await apiCall({
        method: 'POST',
        url: '/profile/picture',               // URL is correct (after backend rename)
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        return {
          success: true,
          url: response.data.url,              // BUG FIX: was response.data.imageUrl
        };
      } else {
        throw new Error(response.error?.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to upload profile picture. Please try again.' });
      throw error;
    }
  },
```

#### 4.1.2 Fix `deleteProfilePicture()` (lines 112-131)

```javascript
async deleteProfilePicture() {
    try {
      const response = await apiCall({
        method: 'DELETE',
        url: '/profile/picture',               // BUG FIX: was '/users/profile/picture'
      });

      if (response.success) {
        return {
          success: true,
          url: response.data.url || null,      // Fallback URL (Google pic or null)
        };
      } else {
        throw new Error(response.error?.message || 'Failed to delete profile picture');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to delete profile picture. Please try again.' });
      throw error;
    }
  },
```

### 4.2 Avatar Upload UI in ProfileHero

**File:** `predictions-frontend/src/components/profile/ProfileHero.jsx`

#### 4.2.1 Update component signature (line 38)

```javascript
const ProfileHero = ({ user, onEditClick, onAvatarUpload, onAvatarDelete, avatarUploading }) => {
```

#### 4.2.2 Replace avatar section (lines 67-86)

Replace the static avatar with an interactive version:

```jsx
{/* Avatar */}
<div className="relative flex-shrink-0">
  <div className="relative group">
    <div className="h-18 w-18 sm:h-22 sm:w-22 md:h-24 md:w-24 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold font-dmSerif shadow-lg shadow-teal-500/25 overflow-hidden">
      {avatarUploading ? (
        {/* Loading spinner during upload */}
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      ) : user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-full h-full object-cover"
        />
      ) : (
        user?.username?.charAt(0)?.toUpperCase() || "U"
      )}
    </div>

    {/* Hover overlay with camera icon */}
    {onAvatarUpload && !avatarUploading && (
      <button
        onClick={() => document.getElementById('avatar-file-input').click()}
        className={`absolute inset-0 rounded-2xl flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer
          bg-black/50`}
      >
        {/* Camera SVG icon (radix-ui doesn't have one) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2
               2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2
               2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0
               01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    )}
  </div>

  {/* Hidden file input */}
  <input
    id="avatar-file-input"
    type="file"
    accept="image/jpeg,image/png,image/gif,image/webp"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) onAvatarUpload(file);
      e.target.value = '';  // Reset so same file can be re-selected
    }}
  />

  {/* "Remove photo" link */}
  {user?.profilePicture && onAvatarDelete && !avatarUploading && (
    <button
      onClick={onAvatarDelete}
      className={`mt-1 text-[10px] font-outfit ${
        text.muted[theme]
      } hover:text-red-400 transition-colors text-center w-full`}
    >
      Remove photo
    </button>
  )}

  {/* Online indicator (keep existing) */}
  <div className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full
    border-[3px] ${theme === "dark" ? "border-slate-800" : "border-white"}
    bg-emerald-500 flex items-center justify-center shadow-sm`}>
    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
  </div>
</div>
```

### 4.3 Wire Up in ProfileView

**File:** `predictions-frontend/src/components/dashboardRenders/ProfileView.jsx`

#### 4.3.1 Add import (at top of file)

```javascript
import { notificationManager } from '../../services/notificationService';
```

#### 4.3.2 Add state (with other state declarations, ~line 193)

```javascript
const [avatarUploading, setAvatarUploading] = useState(false);
```

#### 4.3.3 Add handlers (after existing edit handlers, ~line 388)

```javascript
const handleAvatarUpload = async (file) => {
  // Client-side validation (mirrors server-side)
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    notificationManager.showToast('Image must be under 5MB', 'error');
    return;
  }
  if (!allowedTypes.includes(file.type)) {
    notificationManager.showToast('Only JPG, PNG, GIF, and WEBP formats are allowed', 'error');
    return;
  }

  setAvatarUploading(true);
  try {
    const response = await userAPI.uploadProfilePicture(file);
    if (response.success) {
      // Update local profile state
      setUserProfile(prev => ({ ...prev, profilePicture: response.url }));
      // Update auth context so StatusBar updates too
      updateUser({ profilePicture: response.url, avatar: response.url });
      notificationManager.showToast('Profile picture updated', 'success');
    }
  } catch (err) {
    // Error already handled by userAPI's handleApiError
  } finally {
    setAvatarUploading(false);
  }
};

const handleAvatarDelete = async () => {
  setAvatarUploading(true);
  try {
    const response = await userAPI.deleteProfilePicture();
    if (response.success) {
      const fallbackUrl = response.url || null;
      setUserProfile(prev => ({ ...prev, profilePicture: fallbackUrl }));
      updateUser({ profilePicture: fallbackUrl, avatar: fallbackUrl });
      notificationManager.showToast(
        fallbackUrl ? 'Custom photo removed' : 'Profile picture removed',
        'success'
      );
    }
  } catch (err) {
    // Error already handled
  } finally {
    setAvatarUploading(false);
  }
};
```

#### 4.3.4 Pass props to ProfileHero (~line 485)

```jsx
<ProfileHero
  user={displayUser}
  onEditClick={handleEditClick}
  onAvatarUpload={handleAvatarUpload}
  onAvatarDelete={handleAvatarDelete}
  avatarUploading={avatarUploading}
/>
```

---

## 5. Data Flow Diagrams

### 5.1 Upload Flow

```
User hovers avatar on ProfileHero
  └─ Camera overlay becomes visible (opacity transition)

User clicks overlay
  └─ Hidden <input type="file"> opens native OS file picker

User selects an image file
  └─ onChange fires → handleAvatarUpload(file) in ProfileView

Client-side validation
  ├─ File > 5MB? → toast error, abort
  └─ Not an image? → toast error, abort

setAvatarUploading(true)
  └─ Avatar shows a CSS spinner

userAPI.uploadProfilePicture(file)
  └─ FormData with key "file"
  └─ POST /profile/picture (multipart/form-data)

Spring receives @RequestParam MultipartFile file
  └─ ProfileService.setProfilePicture()
      ├─ Server-side validation (size, content type)
      ├─ deleteOldS3Picture() — removes previous S3 object if exists
      ├─ Upload to S3: profile-pictures/{UUID}/{random}-{filename}
      ├─ Set profilePictureUrl on UserEntity
      ├─ Save to database
      └─ Return S3 URL

Controller returns { url: "https://s3.../..." }

Frontend receives { success: true, url: "..." }
  ├─ setUserProfile(prev => ({ ...prev, profilePicture: url }))
  ├─ updateUser({ profilePicture: url, avatar: url })
  └─ setAvatarUploading(false)

ProfileHero re-renders with new image
StatusBar re-renders with new avatar (via auth context)
```

### 5.2 Delete Flow

```
User clicks "Remove photo" below avatar
  └─ handleAvatarDelete() in ProfileView

setAvatarUploading(true)

userAPI.deleteProfilePicture()
  └─ DELETE /profile/picture

ProfileService.deleteProfilePicture()
  ├─ deleteOldS3Picture() — removes S3 object
  ├─ Set profilePictureUrl = oauthPictureUrl (or null)
  ├─ Save to database
  └─ Return fallback URL (or null)

Controller returns { url: "google-cdn-url" or "", deleted: true }

Frontend receives { success: true, url: "..." or null }
  ├─ OAuth user: fallbackUrl = Google picture URL → shows Google pic
  ├─ Email user: fallbackUrl = null → shows initials
  ├─ Update userProfile + auth context
  └─ setAvatarUploading(false)
```

### 5.3 OAuth Re-login Refresh Flow

```
Google OAuth redirects to backend GET /oauth2/login
  └─ OAuth2Controller.login()

User found in database (returning user)
  └─ Fetch Google userinfo: GET https://openidconnect.googleapis.com/v1/userinfo

Extract new "picture" URL from Google response

Update oauthPictureUrl = newPicture (ALWAYS)

Check if user has a custom picture:
  ├─ profilePictureUrl == oldOauthPictureUrl → NO custom pic
  │   └─ Update profilePictureUrl = newPicture
  └─ profilePictureUrl != oldOauthPictureUrl → HAS custom pic
      └─ Leave profilePictureUrl unchanged (keeps S3 URL)

Save user → set JWT cookies → redirect to frontend
```

---

## 6. Complete File Change Summary

### Backend (7 files, 1 new)

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `db/migration/V21__add_oauth_picture_url.sql` | **CREATE** | New Flyway migration: add `oauth_picture_url` column + backfill |
| 2 | `entity/UserEntity.java` | **MODIFY** | Add `oauthPictureUrl` field (line 30) |
| 3 | `service/ProfileService.java` | **MODIFY** | Add validation to `setProfilePicture()`, add `deleteProfilePicture()`, add `deleteOldS3Picture()` helper |
| 4 | `controller/ProfileController.java` | **MODIFY** | Rename `/upload` → `/picture`, add `DELETE /picture` |
| 5 | `controller/OAuth2Controller.java` | **MODIFY** | Set `oauthPictureUrl` on registration, add Google picture refresh on returning login |
| 6 | `dto/response/ProfileOverview.java` | **MODIFY** | Add `hasOauthPicture` boolean field |
| 7 | `application.yaml` | **MODIFY** | Add `spring.servlet.multipart.max-file-size: 5MB` |

### Frontend (3 files)

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `services/api/userAPI.js` | **MODIFY** | Fix form field name (`file`), fix response parsing (`.url`), fix delete URL (`/profile/picture`) |
| 2 | `components/profile/ProfileHero.jsx` | **MODIFY** | Add camera overlay, hidden file input, "Remove photo" link, loading spinner, new props |
| 3 | `components/dashboardRenders/ProfileView.jsx` | **MODIFY** | Add upload/delete handlers, `avatarUploading` state, pass new props to ProfileHero |

---

## 7. Implementation Order

```
Phase 1: Backend (can be tested with cURL/Postman)
  1. V21 migration
  2. UserEntity — add oauthPictureUrl field
  3. ProfileService — validation + delete logic + S3 cleanup
  4. ProfileController — rename endpoint + add delete endpoint
  5. OAuth2Controller — refresh logic
  6. application.yaml — multipart limits
  7. ProfileOverview — hasOauthPicture field

Phase 2: Frontend API fixes
  8. userAPI.js — fix the 3 bugs

Phase 3: Frontend UI
  9. ProfileHero.jsx — interactive avatar
  10. ProfileView.jsx — handlers + wiring
```

---

## 8. Edge Cases & Considerations

| Scenario | Handling |
|----------|---------|
| **User uploads twice rapidly** | Second upload deletes the first S3 object (via `deleteOldS3Picture`). Only the most recent upload persists. |
| **S3 URL parsing fails** | `deleteOldS3Picture` catches all exceptions silently — orphaned objects can be cleaned up with S3 lifecycle policies later. |
| **Google URL changes format** | The OAuth refresh updates the URL on every login, so new format is picked up automatically. |
| **Browser caches old avatar** | Each S3 upload generates a new random UUID in the key, producing a different URL — natural cache-busting. |
| **OAuth user with no Google picture** | `oauthPictureUrl` could be null. Delete fallback chain: `oauthPictureUrl || null` → shows initials, same as email user. |
| **Large file upload timeout** | 5MB limit keeps uploads fast. Spring's multipart config handles the size check before the controller is even called. |
| **Concurrent uploads from different devices** | Last-write-wins at the database level. Acceptable for a profile picture. |

---

## 9. Testing Checklist

- [ ] **Email/password user — upload**: Profile shows initials → upload JPG → picture appears in ProfileHero and StatusBar
- [ ] **Email/password user — delete**: Has custom picture → click "Remove photo" → falls back to initials
- [ ] **OAuth user — upload**: Shows Google picture → upload custom → shows custom in ProfileHero and StatusBar
- [ ] **OAuth user — delete**: Has custom picture → click "Remove photo" → falls back to Google picture (not initials)
- [ ] **OAuth re-login — no custom**: Change Google profile picture → re-login → app shows new Google picture
- [ ] **OAuth re-login — has custom**: Has S3 upload → change Google picture → re-login → app still shows S3 upload (not Google)
- [ ] **Validation — oversized file**: Try uploading a 10MB image → toast error "Image must be under 5MB"
- [ ] **Validation — wrong type**: Try uploading a `.pdf` → toast error "Only JPG, PNG, GIF, and WEBP formats are allowed"
- [ ] **S3 cleanup**: Upload picture A → upload picture B → verify picture A's S3 object is deleted
- [ ] **StatusBar sync**: After upload, StatusBar avatar updates immediately without page refresh
- [ ] **Loading state**: During upload, avatar shows spinner (not stale image or initials)
