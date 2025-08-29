## Excel Analytics Platform – Client

### Development

Install and run:

```bash
npm install
npm run dev
```

### Google Drive integration (Picker + OAuth)

Create `client/.env` (or `.env.local`) with:

```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

Where to get these values:

1) Google Cloud Console → APIs & Services → Credentials
- Create OAuth 2.0 Client ID (type: Web application)
  - Authorized JavaScript origins: your app origin (e.g. `http://localhost:5173`)
  - Copy the Client ID into `VITE_GOOGLE_CLIENT_ID`
- Create an API key (or reuse an existing one)
  - Enable these APIs for your project: “Google Picker API” and “Google Drive API”
  - Copy the API key into `VITE_GOOGLE_API_KEY`

Restart the client dev server after creating/updating the env file.
