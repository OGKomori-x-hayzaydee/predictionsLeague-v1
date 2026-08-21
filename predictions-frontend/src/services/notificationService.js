// Centralized notification service with activity tracking

// This module builds toasts via raw document.createElement/innerHTML rather
// than React, so icons can't be dropped in as JSX (<Icon />) the way the
// rest of the app does with @phosphor-icons/react. Instead of falling back
// to emoji characters here, each icon is the same Phosphor "regular" weight
// SVG path data (see node_modules/@phosphor-icons/react/dist/defs/*.es.js),
// pre-built into a ready-to-interpolate <svg> markup string once below —
// zero emoji anywhere in this file, including the unmapped-key default.
const ICON_PATHS = {
  'user': 'M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z',
  'user-plus': 'M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z',
  'user-minus': 'M256,136a8,8,0,0,1-8,8H200a8,8,0,0,1,0-16h48A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z',
  'log-out': 'M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z',
  'target': 'M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z',
  'edit': 'M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z',
  'zap': 'M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z',
  'users': 'M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z',
  'mail': 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z',
  'shield': 'M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z',
  'trash': 'M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z',
  'settings': 'M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z',
  'sun': 'M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z',
  'moon': 'M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z',
  'award': 'M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z',
  'trophy': 'M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z',
  'refresh-cw': 'M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43h-.45A79.52,79.52,0,0,0,69.59,72.71,8,8,0,0,1,58.41,61.27a96,96,0,0,1,135,.79L208,76.69V48a8,8,0,0,1,16,0ZM186.41,183.29a80,80,0,0,1-112.47-.66L59.31,168H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V179.31l14.63,14.63A95.43,95.43,0,0,0,130,222.06h.53a95.36,95.36,0,0,0,67.07-27.33,8,8,0,0,0-11.18-11.44Z',
  'wifi': 'M140,204a12,12,0,1,1-12-12A12,12,0,0,1,140,204ZM237.08,87A172,172,0,0,0,18.92,87,8,8,0,0,0,29.08,99.37a156,156,0,0,1,197.84,0A8,8,0,0,0,237.08,87ZM205,122.77a124,124,0,0,0-153.94,0A8,8,0,0,0,61,135.31a108,108,0,0,1,134.06,0,8,8,0,0,0,11.24-1.3A8,8,0,0,0,205,122.77Zm-32.26,35.76a76.05,76.05,0,0,0-89.42,0,8,8,0,0,0,9.42,12.94,60,60,0,0,1,70.58,0,8,8,0,1,0,9.42-12.94Z',
  'wifi-off': 'M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z',
  'info': 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z',
};
// Default icon for unmapped notification.icon keys — a plain bell, not the
// megaphone emoji this used to fall back to.
const DEFAULT_ICON_PATH = 'M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z';

function iconSvg(pathData, size = 20) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor" style="flex-shrink:0"><path d="${pathData}"/></svg>`;
}

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
  LEAGUE_UPDATE: 'league_update',
  LEAGUE_PROMOTE: 'league_promote',
  LEAGUE_REMOVE: 'league_remove',
  LEAGUE_DELETE: 'league_delete',
  
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

// Icon mapping for notifications — every value is pre-built SVG markup (see
// ICON_PATHS/iconSvg above), not an emoji character. 'user-check' reuses the
// plain user glyph (no distinct Phosphor "confirmed user" icon in this set)
// rather than reaching for an unrelated checkmark.
const ICON_MAP = {
  'user': iconSvg(ICON_PATHS.user),
  'user-check': iconSvg(ICON_PATHS.user),
  'user-plus': iconSvg(ICON_PATHS['user-plus']),
  'user-minus': iconSvg(ICON_PATHS['user-minus']),
  'log-out': iconSvg(ICON_PATHS['log-out']),
  'target': iconSvg(ICON_PATHS.target),
  'edit': iconSvg(ICON_PATHS.edit),
  'zap': iconSvg(ICON_PATHS.zap),
  'users': iconSvg(ICON_PATHS.users),
  'mail': iconSvg(ICON_PATHS.mail),
  'shield': iconSvg(ICON_PATHS.shield),
  'trash': iconSvg(ICON_PATHS.trash),
  'settings': iconSvg(ICON_PATHS.settings),
  'sun': iconSvg(ICON_PATHS.sun),
  'moon': iconSvg(ICON_PATHS.moon),
  'award': iconSvg(ICON_PATHS.award),
  'trophy': iconSvg(ICON_PATHS.trophy),
  'refresh-cw': iconSvg(ICON_PATHS['refresh-cw']),
  'wifi': iconSvg(ICON_PATHS.wifi),
  'wifi-off': iconSvg(ICON_PATHS['wifi-off']),
  'info': iconSvg(ICON_PATHS.info),
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
    }),

    updateSuccess: (leagueName) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_UPDATE,
      message: `League "${leagueName}" updated`,
      icon: 'settings',
      metadata: { leagueName }
    }),

    promoteSuccess: (memberName) => this.notify({
      type: NOTIFICATION_TYPES.SUCCESS,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_PROMOTE,
      message: `${memberName} is now a league admin`,
      icon: 'user-plus',
      metadata: { memberName }
    }),

    removeSuccess: (memberName) => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_REMOVE,
      message: `${memberName} removed from the league`,
      icon: 'user-minus',
      metadata: { memberName }
    }),

    deleteSuccess: (leagueName) => this.notify({
      type: NOTIFICATION_TYPES.INFO,
      category: NOTIFICATION_TYPES.LEAGUE,
      action: NOTIFICATION_ACTIONS.LEAGUE_DELETE,
      message: `Everyone removed from "${leagueName}"`,
      icon: 'trash',
      metadata: { leagueName },
      trackAsActivity: false
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
    
    const iconSymbol = ICON_MAP[notification.icon] || iconSvg(DEFAULT_ICON_PATH);
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
          flex-shrink: 0;
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