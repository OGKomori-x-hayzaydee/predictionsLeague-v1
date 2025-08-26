# HTTP-Only Cookies Configuration

This frontend has been updated to work with HTTP-only cookies for authentication. Here are the requirements and changes made:

## Frontend Changes Made

### 1. Base API Configuration (`baseAPI.js`)
- Added `withCredentials: true` to axios instance
- Updated token management to work with HTTP-only cookies
- Modified request interceptor to not add Authorization headers
- Updated response interceptor to handle token refresh via cookies

### 2. Auth API (`authAPI.js`)
- Updated login/register methods to not expect tokens in response
- Authentication state is now managed via HTTP-only cookies automatically

### 3. Auth Context (`AuthContext.jsx`)
- Updated initialization to check auth status via API call
- Uses `/auth/me` endpoint to verify session validity

## Backend Requirements

For this to work, the backend must:

### 1. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173") // Development
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true); // REQUIRED for HTTP-only cookies
            }
        };
    }
}
```

### 2. Cookie Configuration in Auth Endpoints
- `/auth/login` - Set HTTP-only cookies in response
- `/auth/register` - Set HTTP-only cookies in response  
- `/auth/logout` - Clear HTTP-only cookies
- `/auth/refresh` - Handle token refresh via HTTP-only cookies

### 3. Required Endpoints
- `GET /auth/me` - Return current user info (for session validation)
- All endpoints should accept authentication via HTTP-only cookies

### 4. Cookie Settings
```java
ResponseCookie.from("access_token", accessToken)
    .httpOnly(true)
    .secure(true) // For HTTPS in production
    .sameSite("None") // For cross-origin requests
    .path("/")
    .maxAge(Duration.ofMinutes(15))
    .build();
```

## Security Benefits

1. **XSS Protection**: Tokens cannot be accessed via JavaScript
2. **Automatic Management**: Browser handles cookie sending/storage
3. **CSRF Protection**: Should be implemented with CSRF tokens

## Development Notes

- Ensure backend is running and properly configured before testing
- Check browser dev tools → Application → Cookies to verify cookies are set
- Network tab should show cookies being sent with requests automatically
- The `tokenManager.js` utility is no longer needed and can be safely deleted
- Clear any existing localStorage tokens from previous authentication methods
