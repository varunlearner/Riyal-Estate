# Firebase Firestore Setup Checklist

## ✅ What's Been Done

- ✅ Added Firestore to Firebase config (`lib/firebase/config.ts`)
- ✅ Created Firestore service files for all models:
  - `lib/firebase/services/propertyService.ts`
  - `lib/firebase/services/userService.ts`
  - `lib/firebase/services/leadService.ts`
  - `lib/firebase/services/agentProfileService.ts`
  - `lib/firebase/services/savedPropertyService.ts`
- ✅ Updated model files to export Firestore services
- ✅ Updated API routes to use Firestore services:
  - `api/properties/route.ts`
  - `api/users/profile/route.ts`

## 📋 Next Steps to Complete Setup

### 1️⃣ Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Riyal Estate project
3. Navigate to **Firestore Database**
4. Click **Create Database**
5. Select **Production Mode**
6. Choose your preferred region (preferably closer to your users)
7. Click **Create**

### 2️⃣ Environment Variables

Create a `.env.local` file in the root directory with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**To get these values:**
1. In Firebase Console, click the Settings icon ⚙️
2. Select **Project Settings**
3. Go to the **General** tab
4. Scroll down to find "Your apps" section
5. Click on your app and copy the config

### 3️⃣ Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click **Rules** tab
3. Replace the default rules with these:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public collections - anyone can read
    match /properties/{propertyId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    match /agentProfiles/{agentId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // User data - only owner can access
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Leads - only creator/recipient can access
    match /leads/{leadId} {
      allow read, write: if 
        request.auth.uid == resource.data.buyerId || 
        request.auth.uid == resource.data.sellerId;
      allow create: if request.auth != null;
    }

    // Saved properties - only owner can access
    match /savedProperties/{savedId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

### 4️⃣ Data Migration (Optional)

If you have existing data in JSON files, you can migrate to Firestore:

1. In Firebase Console, go to **Firestore**
2. Manually create a sample document in each collection to test connection
3. Or use Firebase Admin SDK script to import from JSON files

### 5️⃣ Test the Connection

Create a test file `test-firestore.ts`:

```typescript
import { propertyService, userService } from '@/lib/firebase/services';

async function testFirestore() {
  try {
    // Test creating a user
    const user = await userService.create({
      firebaseUid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'user',
      isVerified: false,
      isActive: true,
    });
    console.log('✅ User created:', user);

    // Test fetching properties
    const properties = await propertyService.findAll();
    console.log('✅ Properties fetched:', properties.length);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFirestore();
```

### 6️⃣ Update Remaining API Routes

You still need to update these API routes to use Firestore services:

- `app/api/properties/[id]/route.ts`
- `app/api/properties/featured/route.ts`
- `app/api/admin/properties/route.ts`
- `app/api/admin/stats/route.ts`
- `app/api/leads/route.ts`
- `app/api/users/saved-properties/route.ts`
- `app/api/users/sync/route.ts`
- Other API endpoints that still use old models

**Example update pattern:**

```typescript
// OLD (MongoDB)
import { Property } from '@/models/models';
const properties = await Property.find({...});

// NEW (Firestore)
import { propertyService } from '@/lib/firebase/services';
const properties = await propertyService.findAll();
```

### 7️⃣ Test Your Application

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try creating a user account
4. Try creating a property listing
5. Check Firestore Console to verify data is being saved

## 📚 Service API Reference

### propertyService
```typescript
await propertyService.findAll()
await propertyService.findById(id)
await propertyService.findFeatured(limit)
await propertyService.findByOwner(userId)
await propertyService.search(filters)
await propertyService.create(data)
await propertyService.update(id, data)
await propertyService.incrementViews(id)
await propertyService.delete(id)
```

### userService
```typescript
await userService.findAll()
await userService.findById(id)
await userService.findByFirebaseUid(uid)
await userService.findByEmail(email)
await userService.create(data)
await userService.update(id, data)
await userService.addSavedProperty(userId, propertyId)
await userService.removeSavedProperty(userId, propertyId)
await userService.delete(id)
```

### leadService
```typescript
await leadService.findAll()
await leadService.findById(id)
await leadService.findByBuyer(buyerId)
await leadService.findBySeller(sellerId)
await leadService.findByProperty(propertyId)
await leadService.create(data)
await leadService.update(id, data)
await leadService.delete(id)
```

### agentProfileService
```typescript
await agentProfileService.findAll()
await agentProfileService.findById(id)
await agentProfileService.findByUserId(userId)
await agentProfileService.findVerified()
await agentProfileService.create(data)
await agentProfileService.update(id, data)
await agentProfileService.delete(id)
```

### savedPropertyService
```typescript
await savedPropertyService.findByUser(userId)
await savedPropertyService.isSaved(userId, propertyId)
await savedPropertyService.create(data)
await savedPropertyService.delete(userId, propertyId)
await savedPropertyService.deleteByUser(userId)
```

## 🔧 Troubleshooting

### "Firebase not initialized" error
- Make sure `.env.local` has all Firebase config variables
- Restart the dev server after adding env variables

### Firestore permission denied error
- Check your security rules in Firestore Console
- Make sure user is authenticated for write operations

### Data not appearing in Firestore
- Check browser console for errors
- Verify you're signed in with Firebase Auth
- Check Firestore Rules tab to ensure permissions allow the operation

## 📞 Support

For Firestore documentation:
- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

For this project's Firestore implementation, refer to `/FIREBASE_SETUP.md`
