# OAuth2 Frontend Integration

This document outlines the OAuth2 frontend implementation for Spring Security OAuth2 integration.

## Overview

The frontend OAuth implementation uses **server-side redirects** to handle OAuth2 authentication with minimal JavaScript complexity. This approach leverages Spring Security OAuth2's built-in redirect flows and works seamlessly with HTTP-only cookies.

## Architecture

### Flow Diagram
```
1. User clicks OAuth button → Frontend redirects to backend OAuth endpoint
2. Backend handles OAuth flow → User authenticates with provider  
3. Provider redirects to backend → Backend sets HTTP-only cookies
4. Backend redirects to frontend → Frontend processes successful login
```

## Components

### 1. OAuth API Service (`oauthAPI.js`)
- **Purpose**: Manages OAuth provider configuration and initiates OAuth flows
- **Key Methods**:
  - `initiateLogin(provider, redirectPath)` - Starts OAuth flow by redirecting to backend
  - `handleCallback()` - Processes OAuth callback and verifies authentication
  - `getAvailableProviders()` - Returns configured OAuth providers
  - `isOAuthCallback()` - Checks if current URL is an OAuth callback

**Provider Configuration**:
```javascript
providers: {
  google: {
    name: 'Google',
    loginUrl: `${API_BASE_URL}/oauth2/authorization/google`,
    icon: '🟢',
  },
}
```

### 2. OAuth UI Components (`OAuthLogin.jsx`)

#### `OAuthLoginSection`
- Renders OAuth provider buttons with divider
- Integrates into Login and Signup pages
- Handles loading states and error display

#### `OAuthButton` 
- Individual OAuth provider button
- Hover/tap animations with Framer Motion
- Disabled state support

#### `OAuthCallbackHandler`
- Loading screen during OAuth callback processing
- Calls `oauthAPI.handleCallback()` to verify authentication
- Handles success/error scenarios

### 3. OAuth Callback Page (`OAuthCallback.jsx`)
- **Route**: `/auth/oauth/callback`
- **Purpose**: Handles OAuth redirects from backend
- **Process**:
  1. Processes OAuth callback using `OAuthCallbackHandler`
  2. Updates AuthContext with user data
  3. Redirects to intended destination

### 4. Updated Auth Context (`AuthContext.jsx`)
- **New feature**: `skipApiCall` option in login function for OAuth scenarios
- **OAuth support**: Handles OAuth login without making additional API calls
- **Session verification**: Uses `/auth/me` endpoint to verify HTTP-only cookie sessions

### 5. Updated authAPI (`authAPI.js`)
- **New endpoint**: `getCurrentUser()` method for `/auth/me`
- **Purpose**: Verify authentication status using HTTP-only cookies
- **Usage**: Called during app initialization and OAuth callback processing

## Integration Points

### Login Page (`Login.jsx`)
```jsx
{/* OAuth Login Section */}
<OAuthLoginSection 
  onOAuthLogin={handleOAuthLogin}
  disabled={isLoading}
  className="mb-6"
/>
```

### Signup Page (`Signup.jsx`)
```jsx
{/* OAuth Signup Section - Only show on step 1 */}
{formStep === 1 && (
  <OAuthLoginSection 
    onOAuthLogin={handleOAuthSignup}
    disabled={isLoading}
  />
)}
```

### App Router (`App.jsx`)
```jsx
{/* OAuth callback route - publicly accessible during auth process */}
<Route 
  path="/auth/oauth/callback" 
  element={<OAuthCallback />} 
/>
```

## Session Management

### HTTP-Only Cookies
- **Backend responsibility**: Setting secure HTTP-only cookies
- **Frontend approach**: Cookies are automatically included in requests
- **Security**: Frontend cannot access token values directly

### Authentication Verification
- Uses `/auth/me` endpoint to verify active sessions
- Called on app initialization and OAuth callback
- Handles expired/invalid sessions gracefully

## Error Handling

### OAuth Errors
- **URL parameters**: Errors passed via `?error=` query parameter
- **Display**: Shown in login/signup forms using existing error UI
- **Cleanup**: URL parameters cleared after displaying error

### Session Errors
- **Invalid sessions**: Redirect to login page
- **Network errors**: Display user-friendly error messages
- **Fallback**: Always clear local auth state on errors

## Backend Requirements

For this frontend implementation to work, the backend needs:

### 1. OAuth2 Dependencies
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

### 2. OAuth2 Configuration
```java
# application.properties
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```

### 3. Security Configuration
```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .oauth2Login(oauth2 -> oauth2
            .successHandler(oAuth2AuthenticationSuccessHandler)
            .failureHandler(oAuth2AuthenticationFailureHandler)
        );
}
```

### 4. Required Endpoints
- `GET /oauth2/authorization/{provider}` - OAuth2 authorization endpoints (auto-generated)
- `GET /auth/me` - Current user endpoint for session verification
- `POST /auth/logout` - Logout endpoint that clears HTTP-only cookies

### 5. Success Handler
```java
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(...) {
        // Set HTTP-only cookies
        // Redirect to frontend callback URL
        getRedirectStrategy().sendRedirect(request, response, 
            "http://localhost:5173/auth/oauth/callback");
    }
}
```

## Usage Examples

### Basic OAuth Login
```jsx
import oauthAPI from '../services/api/oauthAPI';

// Start OAuth flow
const handleGoogleLogin = () => {
  oauthAPI.initiateLogin('google', '/home/dashboard');
};
```

### Custom OAuth Integration
```jsx
import { OAuthLoginSection } from '../components/auth/OAuthLogin';

// Custom OAuth handler
const handleOAuthLogin = (providerId) => {
  console.log(`Starting OAuth with ${providerId}`);
  oauthAPI.initiateLogin(providerId, '/custom/redirect');
};

// Render OAuth options
<OAuthLoginSection onOAuthLogin={handleOAuthLogin} />
```

### OAuth Callback Processing
```jsx
import { OAuthCallbackHandler } from '../components/auth/OAuthLogin';

const MyCallbackPage = () => {
  const handleSuccess = (result) => {
    console.log('OAuth success:', result.user);
    navigate(result.redirectPath);
  };

  const handleError = (error) => {
    console.error('OAuth failed:', error);
    navigate('/login?error=' + encodeURIComponent(error.message));
  };

  return (
    <OAuthCallbackHandler 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};
```

## Security Considerations

### Frontend Security
- No sensitive tokens stored in localStorage or sessionStorage  
- OAuth providers configured with proper redirect URIs
- Error messages don't expose sensitive information
- Session verification prevents unauthorized access

### Backend Security (Required)
- HTTP-only cookies for token storage
- Secure cookie settings (`secure`, `sameSite`)
- CORS properly configured for OAuth redirects
- OAuth provider client secrets secured

## Testing

### Local Development
1. Configure OAuth providers with `http://localhost:5173/auth/oauth/callback` as redirect URI
2. Set environment variables for OAuth client IDs
3. Test OAuth flow with each provider
4. Verify HTTP-only cookies are set correctly

### Production Deployment
1. Update OAuth redirect URIs to production domain
2. Use production OAuth client IDs/secrets
3. Ensure HTTPS is enabled for OAuth security
4. Test OAuth flow in production environment

## Troubleshooting

### Common Issues
1. **OAuth redirect mismatch**: Ensure redirect URIs match between frontend and OAuth provider
2. **CORS errors**: Backend must allow credentials and proper origins
3. **Cookie issues**: Check secure/sameSite settings for production HTTPS
4. **Session timeout**: Implement proper token refresh handling

### Debug Tools
- Browser Network tab to inspect OAuth redirects
- Application tab to verify HTTP-only cookies
- Console logs for OAuth flow debugging
- Backend logs for OAuth provider responses
