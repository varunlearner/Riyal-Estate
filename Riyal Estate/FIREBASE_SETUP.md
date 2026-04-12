# Firebase Setup Guide

## Environment Variables

Add these to your `.env.local` file (get these from Firebase Console):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firestore Security Rules

Add these rules to your Firestore database in Firebase Console:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to authenticated users
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /properties/{propertyId} {
      allow read: if true; // Public read
      allow create, write: if request.auth != null;
    }

    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }

    match /agentProfiles/{agentId} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }

    match /savedProperties/{savedId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Collections Structure

Your Firestore database will have these collections:

- **users** - User profiles and data
- **properties** - Real estate properties
- **leads** - Property inquiries/leads
- **agentProfiles** - Agent information
- **savedProperties** - User saved properties

## Usage in API Routes

Example usage in your API routes:

```typescript
import { propertyService } from '@/lib/firebase/services';

// Get all properties
const properties = await propertyService.findAll();

// Get property by ID
const property = await propertyService.findById('property-id');

// Create property
const newProperty = await propertyService.create({
  title: 'Beautiful Villa',
  // ... other data
});

// Update property
await propertyService.update('property-id', {
  price: 500000,
});

// Delete property
await propertyService.delete('property-id');
```

## Available Services

### propertyService
- `findAll()` - Get all approved properties
- `findById(id)` - Get property by ID
- `findFeatured(limit)` - Get featured properties
- `findByOwner(userId)` - Get user's properties
- `search(filters)` - Search with filters
- `create(data)` - Create new property
- `update(id, data)` - Update property
- `incrementViews(id)` - Add view count
- `delete(id)` - Delete property

### userService
- `findAll()` - Get all users
- `findById(id)` - Get user by ID
- `findByFirebaseUid(uid)` - Get user by Firebase UID
- `findByEmail(email)` - Get user by email
- `create(data)` - Create new user
- `update(id, data)` - Update user
- `addSavedProperty(userId, propertyId)` - Save property
- `removeSavedProperty(userId, propertyId)` - Unsave property
- `delete(id)` - Delete user

### leadService
- `findAll()` - Get all leads
- `findById(id)` - Get lead by ID
- `findByBuyer(buyerId)` - Get leads by buyer
- `findBySeller(sellerId)` - Get leads by seller
- `findByProperty(propertyId)` - Get leads by property
- `create(data)` - Create new lead
- `update(id, data)` - Update lead
- `delete(id)` - Delete lead

### agentProfileService
- `findAll()` - Get all agent profiles
- `findById(id)` - Get agent by ID
- `findByUserId(userId)` - Get agent by user ID
- `findVerified()` - Get verified agents
- `create(data)` - Create agent profile
- `update(id, data)` - Update agent profile
- `delete(id)` - Delete agent profile

### savedPropertyService
- `findByUser(userId)` - Get user's saved properties
- `isSaved(userId, propertyId)` - Check if saved
- `create(data)` - Save property
- `delete(userId, propertyId)` - Unsave property
- `deleteByUser(userId)` - Delete all user's saved properties
