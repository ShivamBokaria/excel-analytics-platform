// Configuration file for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
  },
  production: {
    // Update this URL with your actual Render server URL
    API_BASE_URL: 'https://excel-analytics-platform-kofn.onrender.com/api',
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

// Export the appropriate config
export const API_BASE_URL = config[env]?.API_BASE_URL || config.development.API_BASE_URL;
