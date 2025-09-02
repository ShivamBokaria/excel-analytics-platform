# Deployment Guide

## Current Issue
Your client deployed on Netlify cannot connect to your server on Render because the API URL is hardcoded to localhost.

## Solution Steps

### 1. Update the Configuration File
Edit `client/src/config/config.js` and replace the placeholder URL with your actual Render server URL:

```javascript
production: {
  // Replace this with your actual Render server URL
  API_BASE_URL: 'https://your-actual-render-app-name.onrender.com/api',
}
```

### 2. Rebuild and Deploy
After updating the config file:
1. Commit and push your changes
2. Netlify will automatically rebuild and deploy
3. Your client should now connect to the Render server

### 3. Verify Your Render Server URL
- Go to your Render dashboard
- Find your deployed service
- Copy the URL (it should look like: `https://your-app-name.onrender.com`)
- Make sure to add `/api` at the end in the config file

### 4. Test the Connection
- Open your Netlify site
- Try to register/login
- Check the browser's Network tab to see if requests are going to the correct URL

## Alternative Solution (Environment Variables)
If you prefer using environment variables:

1. In Netlify, go to Site Settings > Environment Variables
2. Add: `VITE_API_URL` with value: `https://your-render-app-name.onrender.com/api`
3. Rebuild your site

## Troubleshooting
- Check browser console for CORS errors
- Verify your Render server is running and accessible
- Ensure the API endpoints are working (test with Postman)
- Check if your Render server has the correct CORS configuration
