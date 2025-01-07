export const API_BASE_URL = (() => {
    // Dynamically determine the base URL
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000'; // Development
    }
    return 'https://api.production-domain.com'; // Production
  })();
  
  export const ROLES = ['Admin', 'User'];
  export const PLATFORM_STATUSES = ['Active', 'Inactive'];
  