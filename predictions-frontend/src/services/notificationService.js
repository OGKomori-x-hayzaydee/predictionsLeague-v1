// A simple notification service to handle user feedback

let toastTimeout;

// Shows a toast notification
export const showToast = (message, type = 'info', duration = 3000) => {
  // Clear any existing toast
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  // Create toast element if it doesn't exist
  let toast = document.getElementById('toast-notification');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
  }
  
  // Set toast styles based on type
  const bgColor = type === 'success' ? 'bg-green-600' : 
                  type === 'error' ? 'bg-red-600' : 
                  type === 'warning' ? 'bg-amber-600' : 'bg-slate-700';
  
  // Add content and styling
  toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 py-3 px-5 rounded-md ${bgColor} text-white shadow-lg z-50 flex items-center transition-opacity`;
  toast.innerHTML = message;
  
  // Show toast
  toast.style.opacity = 1;
  
  // Auto hide after duration
  toastTimeout = setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Remove after fade out
  }, duration);
};

export default { showToast };