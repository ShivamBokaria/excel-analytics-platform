## Excel Analytics Platform – Client

### Development

Install and run:

```bash
npm install
npm run dev
```

### Social Login Integration

Create `client/.env` (or `.env.local`) with:

```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
VITE_APPLE_CLIENT_ID=YOUR_APPLE_SIGN_IN_CLIENT_ID
```

Where to get these values:

1) **Google Sign-In:**
   - Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (type: Web application)
   - Authorized JavaScript origins: your app origin (e.g. `http://localhost:5173`)
   - Copy the Client ID into `VITE_GOOGLE_CLIENT_ID`

2) **Apple Sign-In:**
   - Apple Developer Console → Certificates, Identifiers & Profiles
   - Create a new App ID with Sign In with Apple capability
   - Create a Services ID for web authentication
   - Copy the Services ID into `VITE_APPLE_CLIENT_ID`

Restart the client dev server after creating/updating the env file.
