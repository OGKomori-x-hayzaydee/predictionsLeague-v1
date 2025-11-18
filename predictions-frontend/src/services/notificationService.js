// Centralized notification service with activity tracking

// Notification Types
export const NOTIFICATION_TYPES = {
  // System
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info',
  
  // Action Categories for Activity Tracking
  PREDICTION: 'prediction',
  LEAGUE: 'league', 
  PROFILE: 'profile',
  AUTH: 'auth',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system'
};

export const NOTIFICATION_ACTIONS = {
  // Auth Actions
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  EMAIL_VERIFY: 'email_verify',
  
  // Profile Actions
  PROFILE_UPDATE: 'profile_update',
  PASSWORD_CHANGE: 'password_change',
  ACCOUNT_DELETE: 'account_delete',
  AVATAR_UPDATE: 'avatar_update',
  
  // Prediction Actions
  PREDICTION_SUBMIT: 'prediction_submit',
  PREDICTION_UPDATE: 'prediction_update',
  CHIP_USE: 'chip_use',
  
  // League Actions
  LEAGUE_CREATE: 'league_create',
  LEAGUE_JOIN: 'league_join',
  LEAGUE_LEAVE: 'league_leave',
  LEAGUE_INVITE: 'league_invite',
  
  // Settings Actions
  THEME_CHANGE: 'theme_change',
  PREFERENCES_UPDATE: 'preferences_update',
  
  // Achievement Actions
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  MILESTONE_REACH: 'milestone_reach',
  
  // System Actions
  DATA_SYNC: 'data_sync',
  OFFLINE_MODE: 'offline_mode'
};

// Icon mapping for notifications
const ICON_MAP = {
  'user': '👤',
  'user-check': '✅',
  'user-plus': '👥',
  'user-minus': '👤',
  'log-out': '🚪',
  'target': '🎯',
  'edit': '✏️',
  'zap': '⚡',
  'users': '👥',
  'mail': '✉️',
  'shield': '🛡️',
  'trash': '🗑️',
  'settings': '⚙️',
  'sun': '☀️',
  'moon': '🌙',
  'award': '🏆',
  'trophy': '🏆',
  'refresh-cw': '🔄',
  'wifi': '📶',
  'wifi-off': '📵',
  'info': 'ℹ️'
};

// Unified Notification Manager
class NotificationManager {
  constructor() {
    this.listeners = new Set();
    this.recentActivities = this.loadRecentActivities();
    this.activeToasts = new Set();
  }

  // Core notification method
  notify(config) {
    const notification = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      ...config
    };

    // Show toast
    this.displayToast(notification);
    
    // Track as activity if it's an action type
    if (config.trackAsActivity !== false) {
      this.addToRecentActivity(notification);
    }
    
    // Notify listeners (for real-time UI updates)
    this.notifyListeners(notification);
    
    return notification;
  }

  // Predefined notification methods for common actions
  auth = {
    loginSuccess: (user) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.AUTH,
      action: NOTIFICATION_ACTIONS.LOGIN,
      message: `Welcome back, ${user.firstName || user.name || 'User'}!`,
      icon: 'user-check'
    }),

    logoutSuccess: () => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.AUTH, 
      action: NOTIFICATION_ACTIONS.LOGOUT,
      message: 'You have been logged out successfully',
      icon: 'log-out'
    }),

    registerSuccess: (user) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.AUTH,
      action: NOTIFICATION_ACTIONS.REGISTER, 
      message: `Welcome to Predictions League, ${user.firstName || user.name || 'User'}!`,
      icon: 'user-plus'
    })
  };

  profile = {
    updateSuccess: () => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.PROFILE,
      action: NOTIFICATION_ACTIONS.PROFILE_UPDATE,
      message: 'Profile updated successfully',
      icon: 'user'
    }),

    passwordChanged: () => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS, 
      category: NOTIFICATION_TYPES.PROFILE,
      action: NOTIFICATION_ACTIONS.PASSWORD_CHANGE,
      message: 'Password changed successfully',
      icon: 'shield'
    }),

    accountDeleted: () => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.PROFILE,
      action: NOTIFICATION_ACTIONS.ACCOUNT_DELETE,
      message: 'Your account has been deleted',
      icon: 'trash',
      trackAsActivity: false // Don't track deletion
    })
  };

  predictions = {
    submitSuccess: (homeTeam, awayTeam) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.PREDICTION,
      action: NOTIFICATION_ACTIONS.PREDICTION_SUBMIT,
      message: `Prediction submitted for ${homeTeam} vs ${awayTeam}`,
      icon: 'target',
      metadata: { homeTeam, awayTeam }
    }),

    updateSuccess: (homeTeam, awayTeam) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.PREDICTION, 
      action: NOTIFICATION_ACTIONS.PREDICTION_UPDATE,
      message: `Prediction updated for ${homeTeam} vs ${awayTeam}`,
      icon: 'edit',
      metadata: { homeTeam, awayTeam }
    }),

    chipUsed: (chipType, homeTeam, awayTeam) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.PREDICTION,
      action: NOTIFICATION_ACTIONS.CHIP_USE, 
      message: `${chipType} chip used on ${homeTeam} vs ${awayTeam}`,
      icon: 'zap',
      metadata: { chipType, homeTeam, awayTeam }
    })
  };

  leagues = {
    createSuccess: (leagueName) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_CREATE,
      message: `League "${leagueName}" created successfully`,
      icon: 'users',
      metadata: { leagueName }
    }),

    joinSuccess: (leagueName) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_JOIN, 
      message: `Successfully joined "${leagueName}"`,
      icon: 'user-plus',
      metadata: { leagueName }
    }),

    leaveSuccess: (leagueName) => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_LEAVE,
      message: `Left "${leagueName}"`,
      icon: 'user-minus', 
      metadata: { leagueName }
    }),

    inviteSent: (leagueName, inviteCount) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_INVITE,
      message: `Invited ${inviteCount} ${inviteCount === 1 ? 'person' : 'people'} to "${leagueName}"`,
      icon: 'mail',
      metadata: { leagueName, inviteCount }
    })
  };

  settings = {
    themeChanged: (theme) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.SYSTEM,
      action: NOTIFICATION_ACTIONS.THEME_CHANGE,
      message: `Switched to ${theme} theme`,
      icon: theme === 'dark' ? 'moon' : 'sun',
      metadata: { theme }
    }),

    preferencesUpdated: () => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.SYSTEM, 
      action: NOTIFICATION_ACTIONS.PREFERENCES_UPDATE,
      message: 'Preferences updated successfully',
      icon: 'settings'
    })
  };

  achievements = {
    unlocked: (achievementName, description) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.ACHIEVEMENT,
      action: NOTIFICATION_ACTIONS.ACHIEVEMENT_UNLOCK,
      message: `Achievement unlocked: ${achievementName}`,
      icon: 'award',
      metadata: { achievementName, description },
      duration: 5000 // Show longer for achievements
    }),

    milestoneReached: (milestone, value) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS, 
      category: NOTIFICATION_TYPES.ACHIEVEMENT,
      action: NOTIFICATION_ACTIONS.MILESTONE_REACH,
      message: `Milestone reached: ${milestone}`,
      icon: 'trophy',
      metadata: { milestone, value },
      duration: 4000
    })
  };

  system = {
    dataSync: () => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.SYSTEM,
      action: NOTIFICATION_ACTIONS.DATA_SYNC, 
      message: 'Data synchronized successfully',
      icon: 'refresh-cw',
      trackAsActivity: false
    }),

    offlineMode: (isOffline) => this.notify({
      type: isOffline ? NOTIFICATION_TYPES.WARNING : NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.SYSTEM,
      action: NOTIFICATION_ACTIONS.OFFLINE_MODE,
      message: isOffline ? 'You are now offline' : 'Back online',
      icon: isOffline ? 'wifi-off' : 'wifi',
      trackAsActivity: false
    })
  };

  // Recent Activity Management
  addToRecentActivity(notification) {
    const activity = {
      id: notification.id,
      type: notification.category,
      action: notification.action, 
      message: notification.message,
      icon: notification.icon,
      timestamp: notification.timestamp,
      metadata: notification.metadata
    };

    this.recentActivities.unshift(activity);
    this.recentActivities = this.recentActivities.slice(0, 4); // Keep 4 most recent
    
    localStorage.setItem('recentActivities', JSON.stringify(this.recentActivities));
    
    // Notify activity listeners
    this.listeners.forEach(listener => {
      if (listener.type === 'activity') {
        listener.callback(this.recentActivities);
      }
    });
  }

  // Simple, reliable toast notifications
  displayToast(notification) {
    console.log('🔔 Displaying notification:', notification);
    
    // Remove any existing toast first to avoid conflicts
    const existingToast = document.getElementById('simple-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'simple-toast';
    
    const iconSymbol = ICON_MAP[notification.icon] || '📢';
    const isDark = localStorage.getItem('theme') === 'dark';
    
    // Simple inline styles that definitely work
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      width: 350px;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      backdrop-filter: blur(10px);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      background: ${isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)'};
      color: ${isDark ? '#f8fafc' : '#0f172a'};
      font-family: 'Inter', system-ui, sans-serif;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease-out;
      pointer-events: auto;
    `;
    
    // Get colors for notification type
    const colors = this.getSimpleColors(notification.type, isDark);
    
    toast.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: ${colors.iconBg};
          color: ${colors.iconColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        ">
          ${iconSymbol}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="
            font-weight: 600;
            font-size: 14px;
            color: ${colors.titleColor};
            margin-bottom: 4px;
            line-height: 1.2;
          ">
            ${this.getNotificationTitle(notification.type)}
          </div>
          <div style="
            font-size: 13px;
            color: ${colors.textColor};
            line-height: 1.4;
            word-wrap: break-word;
          ">
            ${notification.message}
          </div>
        </div>
        <button onclick="document.getElementById('simple-toast').remove()" style="
          width: 24px;
          height: 24px;
          border: none;
          background: ${colors.closeBg};
          color: ${colors.closeColor};
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 16px;
          transition: background-color 0.2s;
        " onmouseover="this.style.background='${colors.closeHover}'" onmouseout="this.style.background='${colors.closeBg}'">
          ×
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 50);
    
    // Auto remove after duration
    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast && toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, notification.duration || 4000);
    
    console.log('✅ Toast displayed successfully');
  }

  removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.transform = 'translateX(100%) !important';
      toast.style.opacity = '0 !important';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.activeToasts.delete(toast);
      }, 300);
    }
  }

  getToastStyles(type, isDark) {
    const styles = {
      success: isDark 
        ? 'bg-slate-800/90 border-emerald-500/30' 
        : 'bg-white/90 border-emerald-200/50',
      error: isDark 
        ? 'bg-slate-800/90 border-red-500/30' 
        : 'bg-white/90 border-red-200/50',
      warning: isDark 
        ? 'bg-slate-800/90 border-amber-500/30' 
        : 'bg-white/90 border-amber-200/50',
      info: isDark 
        ? 'bg-slate-800/90 border-slate-600/30' 
        : 'bg-white/90 border-slate-200/50'
    };
    return styles[type] || styles.info;
  }

  getIconBg(type, isDark) {
    const styles = {
      success: isDark 
        ? 'bg-emerald-500/20 text-emerald-400' 
        : 'bg-emerald-50 text-emerald-600',
      error: isDark 
        ? 'bg-red-500/20 text-red-400' 
        : 'bg-red-50 text-red-600',
      warning: isDark 
        ? 'bg-amber-500/20 text-amber-400' 
        : 'bg-amber-50 text-amber-600',
      info: isDark 
        ? 'bg-slate-600/20 text-slate-400' 
        : 'bg-slate-100 text-slate-600'
    };
    return styles[type] || styles.info;
  }

  getTextColor(type, isDark) {
    const styles = {
      success: isDark ? 'text-emerald-300' : 'text-emerald-800',
      error: isDark ? 'text-red-300' : 'text-red-800',
      warning: isDark ? 'text-amber-300' : 'text-amber-800',
      info: isDark ? 'text-slate-200' : 'text-slate-800'
    };
    return styles[type] || styles.info;
  }

  getSecondaryTextColor(type, isDark) {
    const styles = {
      success: isDark ? 'text-emerald-200/80' : 'text-emerald-700/80',
      error: isDark ? 'text-red-200/80' : 'text-red-700/80',
      warning: isDark ? 'text-amber-200/80' : 'text-amber-700/80',
      info: isDark ? 'text-slate-300/80' : 'text-slate-600/80'
    };
    return styles[type] || styles.info;
  }

  getCloseButtonStyle(type, isDark) {
    const styles = {
      success: isDark 
        ? 'text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-500/10' 
        : 'text-emerald-600/60 hover:text-emerald-800 hover:bg-emerald-100',
      error: isDark 
        ? 'text-red-400/60 hover:text-red-300 hover:bg-red-500/10' 
        : 'text-red-600/60 hover:text-red-800 hover:bg-red-100',
      warning: isDark 
        ? 'text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10' 
        : 'text-amber-600/60 hover:text-amber-800 hover:bg-amber-100',
      info: isDark 
        ? 'text-slate-400/60 hover:text-slate-300 hover:bg-slate-600/10' 
        : 'text-slate-600/60 hover:text-slate-800 hover:bg-slate-100'
    };
    return styles[type] || styles.info;
  }

  getNotificationTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return titles[type] || titles.info;
  }

  getSimpleColors(type, isDark) {
    const colors = {
      success: {
        iconBg: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
        iconColor: isDark ? '#34d399' : '#059669',
        titleColor: isDark ? '#34d399' : '#065f46',
        textColor: isDark ? '#a7f3d0' : '#047857',
        closeBg: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        closeColor: isDark ? '#34d399' : '#059669',
        closeHover: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'
      },
      error: {
        iconBg: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        iconColor: isDark ? '#f87171' : '#dc2626',
        titleColor: isDark ? '#f87171' : '#991b1b',
        textColor: isDark ? '#fecaca' : '#b91c1c',
        closeBg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
        closeColor: isDark ? '#f87171' : '#dc2626',
        closeHover: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
      },
      warning: {
        iconBg: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
        iconColor: isDark ? '#fbbf24' : '#d97706',
        titleColor: isDark ? '#fbbf24' : '#92400e',
        textColor: isDark ? '#fed7aa' : '#a16207',
        closeBg: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
        closeColor: isDark ? '#fbbf24' : '#d97706',
        closeHover: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'
      },
      info: {
        iconBg: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)',
        iconColor: isDark ? '#94a3b8' : '#64748b',
        titleColor: isDark ? '#cbd5e1' : '#475569',
        textColor: isDark ? '#e2e8f0' : '#64748b',
        closeBg: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.05)',
        closeColor: isDark ? '#94a3b8' : '#64748b',
        closeHover: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)'
      }
    };
    return colors[type] || colors.info;
  }

  // Subscription methods for React components
  subscribe(callback, type = 'notification') {
    const listener = { callback, type };
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(notification) {
    this.listeners.forEach(listener => {
      if (listener.type === 'notification') {
        listener.callback(notification);
      }
    });
  }

  loadRecentActivities() {
    try {
      return JSON.parse(localStorage.getItem('recentActivities') || '[]');
    } catch {
      return [];
    }
  }

  getRecentActivities() {
    return this.recentActivities;
  }

  // Legacy support for existing showToast calls
  showToast(message, type = 'info', duration = 3000) {
    if (typeof message === 'string') {
      // Legacy call - convert to new format
      return this.notify({
        type,
        message,
        duration,
        icon: 'info',
        trackAsActivity: false
      });
    } else {
      // New format - message is the notification object
      const notification = message;
      this.displayToast(notification);
    }
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();

// Legacy export for backward compatibility
export const showToast = (message, type = 'info', duration = 3000) => {
  return notificationManager.showToast(message, type, duration);
};

export default notificationManager;