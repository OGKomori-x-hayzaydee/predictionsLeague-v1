# Frontend Roadmap: RESTful API Integration (Strategy 1)

**Project**: Predictions League v1  
**Strategy**: RESTful API with Axios  
**Last Updated**: July 11, 2025  
**Total Estimated Time**: 20-25 hours

---

## 📋 Implementation Phases

### **Phase 1: Foundation Setup** ✅ *Complete*
**Goal**: Establish core infrastructure for API communication  
**Estimated Time**: 2-3 hours

**Dependencies to Install:**
- [x] `axios` for HTTP requests
- [x] `@tanstack/react-query` for server state management  
- [x] `js-cookie` for token storage (optional)

**Tasks:**
- [x] Install required dependencies
- [x] Create Axios instance with base configuration
- [x] Set up request/response interceptors
- [x] Implement error handling utilities
- [x] Configure CORS settings (frontend side)
- [x] Create AuthContext for global auth state
- [x] Implement token storage/retrieval logic
- [x] Add protected route wrapper component

**Deliverables:**
- [x] `src/services/api/baseAPI.js`
- [x] `src/context/AuthContext.jsx` (enhanced)
- [x] `src/utils/apiErrorHandler.js`
- [x] `src/components/common/PrivateRoute.jsx`

**Notes:**
- ✅ All dependencies installed successfully
- ✅ Base API infrastructure created with interceptors
- ✅ Error handling utilities implemented
- ✅ AuthContext created with mock authentication (ready for backend integration)
- ✅ PrivateRoute, PublicRoute, and ConditionalRoute components created
- ✅ Environment variables configured
- ✅ React Query context set up with DevTools
- ✅ App.jsx updated with all new contexts and protected routing

---

### **Phase 2: Authentication Implementation** ✅ *Complete*
**Goal**: Connect existing login/signup pages to backend  
**Estimated Time**: 3-4 hours

**Tasks:**
- [x] Create auth API service with endpoints:
  - [x] Login endpoint integration
  - [x] Registration endpoint integration
  - [x] Logout functionality
  - [x] Send OTP endpoint integration
  - [x] Verify OTP endpoint integration
- [x] Update existing authentication pages:
  - [x] Modify `Login.jsx` to use real API calls
  - [x] Update `Signup.jsx` to connect to backend
  - [x] Add form validation and error display
  - [x] Implement loading states
- [x] Implement route protection:
  - [x] PrivateRoute component (completed in Phase 1)
  - [x] Redirect logic for unauthenticated users
  - [x] Auto-redirect after successful login
- [x] Switch from TempAuthContext to real AuthContext
- [x] Test real backend integration

**Deliverables:**
- [x] `src/services/api/authAPI.js` - Updated with backend endpoints
- [x] Updated `src/pages/Login.jsx` - Now using real auth
- [x] Updated `src/pages/Signup.jsx` - Now using real auth with firstName/lastName
- [x] `src/components/common/PrivateRoute.jsx` - Real route protection
- [x] Real logout functionality in VerticalMenu

**Notes:**
- ✅ Auth API service created with all required backend endpoints
- ✅ **Real authentication now active** - No more mock data
- ✅ Login and signup pages connected to live backend
- ✅ AuthContext updated to use real API calls instead of mock
- ✅ Token refresh mechanism implemented in baseAPI interceptors  
- ✅ Form validation enhanced with client-side and server-side error handling
- ✅ Loading states and redirect logic implemented
- ✅ Helper hooks created (useAuth, useApi, useProtectedRoute)
- ✅ Token manager utility implemented
- ✅ **LIVE BACKEND INTEGRATION COMPLETE** - Ready for user management and league features
- 🔄 OTP verification endpoints ready for future email verification features

---

### **Phase 3: User Management** ✅ *Complete*
**Goal**: User profile and preferences functionality  
**Estimated Time**: 2-3 hours

**Tasks:**
- [x] Create user API service:
  - [x] Get user profile endpoint
  - [x] Update profile information endpoint
  - [x] User preferences management
- [x] Update profile components:
  - [x] Enhance existing `ProfileView.jsx`
  - [x] Add profile editing functionality
- [x] Backend integration setup:
  - [x] Switch from TempAuthContext to real AuthContext
  - [x] Update all auth-dependent components
  - [x] Test with live backend authentication

**Deliverables:**
- [x] `src/services/api/userAPI.js`
- [x] Enhanced `src/components/dashboardRenders/ProfileView.jsx`
- [x] Real authentication integration
- [x] Live backend connection established

**Notes:**
- ✅ userAPI.js created with comprehensive profile and preferences endpoints
- ✅ ProfileOverview.jsx enhanced with editable profile functionality
- ✅ Fixed Router nesting issue and import path errors
- ✅ JSX structure issues resolved in ProfileOverview component
- ✅ **Switched from TempAuthContext to real AuthContext**
- ✅ **All auth-dependent components now use real backend**
- ✅ **Application successfully connected to live backend**
- ✅ **Authentication flow working with backend API**
- 🔄 Ready to extend user management with backend user data

---

### **Phase 4: League Management** 🚧 *In Progress*
**Goal**: Connect league functionality to backend  
**Estimated Time**: 4-5 hours

**Tasks:**
- [x] Create league API service:
  - [x] Create league endpoint
  - [x] Join league (by code/invitation) endpoint
  - [x] Get user's leagues endpoint
  - [x] League details and settings endpoint
  - [ ] Leave league functionality
- [ ] Update league components:
  - [ ] Update `LeaguesView.jsx` with real data
  - [ ] Enhance `LeagueDetailView.jsx`
  - [ ] Update `LeagueManagementView.jsx`
  - [ ] Add league creation flow
- [ ] Implement league state management:
  - [ ] League context or React Query integration
  - [ ] Real-time league data updates
  - [ ] Optimistic updates for better UX

**Deliverables:**
- [x] `src/services/api/leagueAPI.js`
- [x] Cleaned up `src/hooks/useLeagues.js` to use leagueAPI properly
- [x] Updated authAPI.js to handle frontend password validation
- [ ] Finish updating `src/components/dashboardRenders/LeaguesView.jsx`
- [ ] Updated `src/components/dashboardRenders/LeagueDetailView.jsx`
- [ ] Updated `src/components/dashboardRenders/LeagueManagementView.jsx`
- [ ] League state management system

**Notes:**
- ✅ leagueAPI.js created with comprehensive league endpoints and fallback mock data
- ✅ useLeagues.js refactored to use leagueAPI with proper error handling
- ✅ Removed duplicate/conflicting mock data from useLeagues.js 
- ✅ Added getFeaturedLeagues endpoint to leagueAPI with mock data
- ✅ AuthAPI updated to handle password confirmation validation on frontend
- 🔄 Application working with mock data - ready for backend integration
- 🔄 Next: Continue with league UI components and other roadmap phases

---

## 🎯 **CURRENT STATUS: Live Backend Integration Complete!**

**✅ MAJOR MILESTONE ACHIEVED:**
- **Real Authentication Working**: Users can register, login, and logout with live backend
- **JWT Token Management**: Tokens properly stored, sent with requests, and cleared on logout  
- **Route Protection**: PrivateRoute and PublicRoute working with real auth state
- **Form Integration**: Signup form sends complete user data (username, email, password, firstName, lastName, favoriteTeam)
- **Error Handling**: Proper API error handling and user feedback

**🚀 NEXT STEPS - Receiving Backend Functionality:**

### **Step 1: Replace Mock User Data (Priority 1)**
```javascript
// Current: ProfileView uses mock data
// Target: Connect to real user data from backend
// Files to update:
- src/components/dashboardRenders/ProfileView.jsx
- src/components/profile/ProfileOverview.jsx  
- Connect to userAPI.getCurrentUser()
```

### **Step 2: Complete League Backend Integration (Priority 2)**  
```javascript
// Current: leagueAPI exists but LeaguesView still uses some mock data
// Target: Full league management with backend
// Files to update:
- src/components/dashboardRenders/LeaguesView.jsx
- src/components/dashboardRenders/LeagueDetailView.jsx
- Test create/join/leave league functionality
```

### **Step 3: Add Remaining Backend Endpoints (Priority 3)**
```javascript
// Add any missing endpoints your backend supports:
- User preferences/settings management
- League member management 
- Any additional user profile fields
- File upload for profile pictures (if supported)
```

### **Step 4: Error Handling & UX Polish (Priority 4)**
```javascript
// Enhance error handling for all backend interactions:
- Network connection errors
- API validation errors
- Expired token handling
- Loading states for all API calls
```

---

## 🔧 Technical Configuration

### **Dependencies Added:**
```json
{
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0", 
  "js-cookie": "^3.0.5"
}
```

### **New Directory Structure:**
```
src/
├── services/
│   ├── api/
│   │   ├── baseAPI.js
│   │   ├── authAPI.js
│   │   ├── userAPI.js
│   │   ├── leagueAPI.js
│   │   ├── fixtureAPI.js
│   │   ├── predictionAPI.js
│   │   └── dashboardAPI.js
│   └── auth/
│       └── authService.js
├── context/
│   ├── AuthContext.jsx (enhanced)
│   └── QueryContext.jsx (new)
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useProtectedRoute.js
└── utils/
    ├── apiErrorHandler.js
    ├── tokenManager.js
    └── apiCache.js
```

### **Environment Variables Needed:**
- [ ] `VITE_API_BASE_URL` - Backend API base URL
- [ ] `VITE_API_TIMEOUT` - Request timeout (optional)

---

## 🎯 Success Criteria

**After completion, the frontend will:**
- [ ] ✅ Authenticate users with backend JWT tokens
- [ ] ✅ Display real fixture data from backend
- [ ] ✅ Allow users to create and join leagues
- [ ] ✅ Enable prediction submissions with validation
- [ ] ✅ Show real-time standings and statistics
- [ ] ✅ Handle errors gracefully with user feedback
- [ ] ✅ Provide smooth loading states and transitions
- [ ] ✅ Work offline with cached data when possible

---

## 📝 Implementation Log

### Current Status: 🚧 Phase 1 Complete - Ready for Phase 2

**Next Action**: Begin Phase 2 - Authentication Implementation

**Implementation Notes:**
- **Phase 1 Completed**: Foundation infrastructure is in place
- **Mock Authentication**: AuthContext has placeholder authentication that will be replaced with real API calls in Phase 2
- **Protected Routing**: All routes are now properly protected with authentication checks
- **Environment Setup**: .env file created for API configuration
- **React Query**: Configured with sensible defaults and dev tools

---

## 🚀 Getting Started

**To begin implementation:**
1. Ensure backend is running and accessible
2. Start with Phase 1 - Foundation Setup
3. Check off tasks as completed
4. Update notes section with any issues or decisions
5. Move to next phase when current phase is complete

**Backend Requirements:**
- [ ] Backend server running on defined port
- [ ] CORS configured for frontend domain
- [ ] Basic auth endpoints available for testing

---

*This roadmap will be updated as implementation progresses. Check off completed items and add notes as needed.*
