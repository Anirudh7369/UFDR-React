# Google OAuth Setup Guide

## Steps to Configure Google OAuth

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "ForensicAnalyst AI")
4. Click "Create"

### 2. Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in required fields:
   - App name: ForensicAnalyst AI
   - User support email: Your email
   - Developer contact information: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users (your Gmail addresses)
8. Click "Save and Continue"

### 4. Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "ForensicAnalyst Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:3001` (if you use different port)
6. Add Authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3001`
7. Click "Create"
8. Copy your Client ID (it looks like: `xxxxx.apps.googleusercontent.com`)

### 5. Configure Your App

1. Create a `.env` file in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Add your Client ID to `.env`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

3. Restart your development server:
   ```bash
   npm start
   ```

## Troubleshooting

### Error 401: invalid_client
- Make sure your Client ID is correct
- Check that authorized JavaScript origins include your localhost URL
- Verify the OAuth consent screen is configured

### Redirect URI Mismatch
- Add your exact URL to authorized redirect URIs
- Include both http://localhost:3000 and the port you're using

### "This app isn't verified"
- Click "Advanced" → "Go to [App Name] (unsafe)"
- This only appears during development with test users
- For production, you'll need to verify your app

## Production Deployment

When deploying to production:

1. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
2. Update `.env` for production with the same Client ID
3. Consider verifying your app to remove the "unverified" warning
