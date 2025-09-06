class OAuthStateManager {
  constructor() {
    this.STATE_KEY = "oauth_state";
    this.ERROR_KEY = "oauth_error";
  }

  // Check if there's an active OAuth session

  isActive() {
    const state = this.getState();
    if (!state) return false;

    // Check if session is expired (10 minutes max)
    const elapsed = Date.now() - state.timestamp;
    return elapsed < 600000; // 10 minutes
  }

  // Get OAuth state

  getState() {
    try {
      const state = sessionStorage.getItem(this.STATE_KEY);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error("Error reading OAuth state:", error);
      return null;
    }
  }

  // Set OAuth error
  setError(error) {
    sessionStorage.setItem(this.ERROR_KEY, error);
  }

  // Get OAuth error
  getError() {
    return sessionStorage.getItem(this.ERROR_KEY);
  }

  //Complete OAuth flow

  complete(userData) {
    const state = this.getState();
    this.clearState();

    return {
      user: userData,
      redirectPath: state?.redirectPath || "/home/dashboard",
      flowType: state?.flowType || "login",
    };
  }

  // Clear OAuth state
  clearState() {
    sessionStorage.removeItem(this.STATE_KEY);
    sessionStorage.removeItem(this.ERROR_KEY);
  }
}

const oauthStateManager = new OAuthStateManager();
export default oauthStateManager;
