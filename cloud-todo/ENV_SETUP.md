# 🔒 Environment Variables Setup

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click ⚙️ Settings → Project settings
   - Scroll down to "Your apps" section
   - Copy the config values

3. **Fill in your `.env` file:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
   ```

## Important Notes

### ⚠️ Security
- **Never commit `.env` to Git** - It's already in `.gitignore`
- The `.env` file contains sensitive credentials
- Use `.env.example` to show the structure without exposing real values

### 🔄 Environment Files
- `.env` - Your actual credentials (local development)
- `.env.example` - Template file (safe to commit to Git)
- `.env.local` - Local overrides (also ignored by Git)
- `.env.production` - Production environment (ignored by Git)

### 📝 Vite Environment Variables
- Vite only exposes variables prefixed with `VITE_`
- Access them using `import.meta.env.VITE_*`
- They are embedded at **build time**, not runtime

### 🚀 Deployment

#### Firebase Hosting
When deploying to Firebase, you have options:

**Option 1: Use Firebase Environment Config**
```bash
firebase functions:config:set firebase.api_key="your_key"
```

**Option 2: Build Locally**
```bash
# Build with your local .env
npm run build
firebase deploy
```

**Option 3: GitHub Actions (Recommended)**
Add secrets to your GitHub repository:
- Settings → Secrets and variables → Actions
- Add each `VITE_FIREBASE_*` variable
- Update your workflow to use secrets

Example GitHub Actions:
```yaml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
  # ... other variables
```

## Troubleshooting

### App doesn't load after changing to .env
1. **Restart dev server**: `npm run dev` (Vite needs restart for .env changes)
2. **Check variable names**: Must start with `VITE_`
3. **Check .env location**: Must be in project root (same level as package.json)

### Firebase "Invalid API key" error
1. Verify API key is correct (no extra spaces)
2. Check Firebase Console → Settings → Web API Key is enabled
3. Ensure `.env` file is properly formatted (no quotes needed)

### Variables are undefined
```javascript
// ✅ Correct
import.meta.env.VITE_FIREBASE_API_KEY

// ❌ Wrong
process.env.VITE_FIREBASE_API_KEY  // This is for Node.js, not Vite
```

## Testing

Check if environment variables are loaded:
```javascript
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
```

## Best Practices

1. ✅ **Keep .env in .gitignore**
2. ✅ **Use .env.example for documentation**
3. ✅ **Never hardcode credentials in source files**
4. ✅ **Rotate keys if accidentally exposed**
5. ✅ **Use different Firebase projects for dev/prod**

## Firebase Security Rules

Even with environment variables, set up proper Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.user;
    }
  }
}
```

This ensures data security even if API keys are exposed.

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs/web/setup)
