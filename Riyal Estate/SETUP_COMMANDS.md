# 🚀 Riyal Estate - Step-by-Step Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project credentials
- Cloudinary account credentials

---

## STEP 1: Install Dependencies

```bash
npm install
```

**What this does:**
- Installs all required packages from `package.json`
- Creates `node_modules/` directory
- Takes about 2-3 minutes

**Expected output:**
```
added XXX packages, and audited YYY packages in Xm
```

---

## STEP 2: Create Environment File

Create a `.env.local` file in the project root with the following:

```env
# Database Configuration
USE_JSON_DB=true

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=development

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to get these credentials:

**Firebase:**
1. Go to https://console.firebase.google.com
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Click "Web" if not already created
6. Copy the config values

**Cloudinary:**
1. Go to https://cloudinary.com
2. Sign up/login
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret

---

## STEP 3: Run Development Server

```bash
npm run dev
```

**What this does:**
- Starts Next.js development server
- Watches for file changes
- Enables hot reload
- Compiles TypeScript on the fly

**Expected output:**
```
> holy-estates@1.0.0 dev
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in XXXms
```

---

## STEP 4: Open in Browser

Once you see "Ready in..." message:

1. Open browser
2. Go to: **http://localhost:3000**
3. You should see the Riyal Estate homepage

---

## Alternative Commands

### Build for Production

```bash
npm run build
```

**What this does:**
- Compiles the entire project
- Optimizes for production
- Checks for build errors
- Takes 2-5 minutes

**Expected output:**
```
✓ Compiled successfully
✓ Linting and type checking
✓ Ready for production
```

---

### Start Production Server

After building:

```bash
npm start
```

**What this does:**
- Starts optimized production server
- Uses compiled code from `.next/` directory
- Faster than development mode

---

## Quick Reference - Copy and Paste These Commands

### Option 1: Development (Recommended)

```bash
# Step 1: Install dependencies
npm install

# Step 2: Run development server
npm run dev

# Server will be ready at http://localhost:3000
```

### Option 2: Production Build

```bash
# Step 1: Install dependencies
npm install

# Step 2: Build project
npm run build

# Step 3: Start production server
npm start

# Server will be running in production mode
```

---

## Troubleshooting

### Issue: `npm command not found`
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Port 3000 already in use
**Solution:** 
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: Module not found errors
**Solution:**
```bash
# Clear cache and reinstall
rm -r node_modules
npm install
```

### Issue: Database connection errors
**Solution:**
- Check `.env.local` file exists
- Verify `USE_JSON_DB=true` is set
- Check `/data/` folder has write permissions

### Issue: Firebase authentication not working
**Solution:**
- Verify all Firebase credentials in `.env.local`
- Check Firebase project has Authentication enabled
- Ensure Google sign-in is enabled in Firebase Console

### Issue: Image upload not working
**Solution:**
- Verify Cloudinary credentials in `.env.local`
- Check Cloudinary account has active API quota

---

## File Structure After Setup

```
holy-estates/
├── .env.local              # ← Create this with your credentials
├── .next/                  # ← Generated after build/run
├── node_modules/           # ← Created by npm install
├── data/                   # ← JSON database files (auto-created)
│   ├── users.json
│   ├── properties.json
│   ├── leads.json
│   ├── saved-properties.json
│   └── agent-profiles.json
├── app/
├── components/
├── lib/
├── models/
├── public/
├── package.json
└── ...other files...
```

---

## Common Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run with specific port
npm run dev -- -p 3001

# Check Next.js version
npm list next

# Update packages
npm update

# Clear npm cache
npm cache clean --force
```

---

## Next Steps After Running

1. **Register/Login** - Create an account using Firebase auth
2. **Post Property** - Add a property listing (saves to JSON)
3. **Browse Properties** - Search and filter properties
4. **Admin Dashboard** - Change user role to "admin" in JSON to access admin panel

---

## Database Files Location

All data is stored as JSON files in `/data/`:
- `users.json` - User profiles
- `properties.json` - Property listings
- `leads.json` - Inquiries/contacts
- `saved-properties.json` - Saved properties
- `agent-profiles.json` - Agent information

**Note:** These are created automatically when data is added through the app.

---

## Support

If you encounter any issues:
1. Check error messages in terminal
2. Check browser console (F12)
3. Verify `.env.local` file
4. Check Firebase and Cloudinary credentials
5. Ensure Node.js version 18+

---

**Happy coding! 🎉**

Built with ❤️ by Riyal Estate Team
