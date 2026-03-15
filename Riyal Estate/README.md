Perfect! Here's a complete summary of your Riyal Estate project setup:

## 🎯 Quick Summary

Your **Riyal Estate** property marketplace app is fully configured and ready to run! Here's what you need to do:

### Step 1: Install Dependencies
```bash
npm install# Riyal Estate - Premium Property Marketplace

A modern real estate marketplace platform built with Next.js 14, JSON-based database, Firebase Authentication, and Cloudinary. Fast, lightweight, and production-ready.

## Features

### For Buyers/Tenants
- Search properties by city, locality, price, BHK, and more
- View detailed property listings with photos and amenities
- Save favorite properties to wishlist
- Contact property owners directly
- EMI Calculator
- Compare properties

### For Owners/Agents
- Post properties for free
- Manage property listings
- View inquiries and leads
- Upload multiple property photos
- Track listing performance (views, inquiries)

### For Admin
- Dashboard with analytics
- Approve/reject property listings
- Feature listings
- Manage users and agents
- View all leads

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: JSON file-based storage (lightweight & fast)
- **Authentication**: Firebase Auth (Google + Email/Password)
- **Image Storage**: Cloudinary
- **Design**: Modern amber/gold color scheme with smooth animations
- **Deployment**: Ready for Vercel, Google Cloud Run, or any Node.js host

## Prerequisites

- Node.js 18+ 
- Firebase project
- Cloudinary account
- npm or yarn package manager

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database Configuration
USE_JSON_DB=true
# Data is stored in /data/ directory as JSON files
# No MongoDB URI needed - lightweight JSON storage

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

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create .env.local with Firebase and Cloudinary credentials

# 3. Run development server
npm run dev

# 4. Access the application
# Open http://localhost:3000 in your browser

# Build and Deploy
npm run build    # Build for production
npm start        # Start production server
```

## Database

Data is stored in `/data/` directory as JSON files:
- `users.json` - User profiles
- `properties.json` - Property listings
- `leads.json` - User inquiries
- `saved-properties.json` - Saved/wishlist items
- `agent-profiles.json` - Agent information

No external database setup needed!

## Project Structure

```
riyal-estate/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin endpoints
│   │   ├── leads/         # Lead management
│   │   ├── properties/    # Property endpoints
│   │   ├── users/         # User endpoints
│   │   ├── upload/        # Image upload
│   │   └── ...
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property pages
│   ├── search/            # Search functionality
│   ├── admin/             # Admin pages
│   ├── globals.css        # Global styles (Amber/Gold theme)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── ui/               # UI components (Button, Input, Card, etc.)
│   ├── layout/           # Layout (Navbar, Footer)
│   ├── property/         # Property-specific components
│   ├── forms/            # Form components
│   ├── search/           # Search components
│   ├── dashboard/        # Dashboard components
│   └── admin/            # Admin components
├── lib/                   # Utility functions & libraries
│   ├── db/               # Database layer
│   │   ├── json-db.ts    # JSON database engine
│   │   ├── repository.ts # Repository pattern
│   │   ├── model-adapters.ts # Model adapters
│   │   └── init.ts       # Database initializer
│   ├── firebase/         # Firebase config & auth
│   │   ├── auth.ts       # Authentication logic
│   │   └── config.ts     # Firebase configuration
│   └── utils/            # Helper functions
├── models/               # Data models
│   ├── User.ts
│   ├── Property.ts
│   ├── Lead.ts
│   ├── SavedProperty.ts
│   └── AgentProfile.ts
├── data/                 # JSON data storage
│   ├── users.json
│   ├── properties.json
│   ├── leads.json
│   ├── saved-properties.json
│   └── agent-profiles.json
├── hooks/                # Custom React hooks
│   ├── useAuth.tsx       # Authentication hook
│   └── useProperties.ts  # Properties hook
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── middleware.ts         # Next.js middleware
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS (Amber color scheme)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## API Routes

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create new property
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/[id]` - Get property by ID
- `PUT /api/properties/[id]` - Update property (owner/admin)
- `DELETE /api/properties/[id]` - Delete property (owner/admin)

### Users
- `POST /api/users/sync` - Sync user with Firebase
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users/saved-properties` - Get saved properties (authenticated)
- `POST /api/users/saved-properties` - Save property (authenticated)
- `DELETE /api/users/saved-properties` - Remove saved property (authenticated)

### Leads
- `GET /api/leads` - Get leads
- `POST /api/leads` - Create lead (contact owner)
- `PUT /api/leads` - Update lead status

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/properties` - Get all properties with details (admin only)
- `PUT /api/admin/properties` - Update property status (admin only)
- `POST /api/admin/properties` - Approve/feature properties (admin only)

### Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload` - Delete image from Cloudinary

## Database Models

### User (JSON Structure)
```json
{
  "id": "uuid",
  "firebaseUid": "string",
  "email": "string",
  "phone": "string",
  "displayName": "string",
  "photoURL": "string",
  "role": "user|owner|agent|admin",
  "isVerified": "boolean",
  "isActive": "boolean",
  "savedProperties": ["propertyId1", "propertyId2"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Property (JSON Structure)
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "propertyType": "string",
  "listingType": "sale|rent",
  "price": "number",
  "area": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "furnished": "string",
  "possession": "string",
  "address": { "street": "string", "city": "string", "state": "string", "pincode": "string" },
  "location": { "lat": "number", "lng": "number" },
  "amenities": ["string"],
  "images": ["cloudinary_url"],
  "owner": { "id": "string", "name": "string", "phone": "string" },
  "agent": { "id": "string", "name": "string", "phone": "string" },
  "status": "pending|approved|rejected|sold|rented",
  "isFeatured": "boolean",
  "views": "number",
  "inquiries": "number",
  "shortlists": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Lead (JSON Structure)
```json
{
  "id": "uuid",
  "propertyId": "string",
  "buyerId": "string",
  "sellerId": "string",
  "message": "string",
  "status": "new|contacted|interested|not_interested",
  "notes": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### SavedProperty (JSON Structure)
```json
{
  "id": "uuid",
  "userId": "string",
  "propertyId": "string",
  "createdAt": "timestamp"
}
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
The JSON database files will persist with Vercel's storage.

### Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables (Firebase & Cloudinary)
4. Deploy

### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/riyal-estate

# Deploy to Cloud Run
gcloud run deploy riyal-estate --image gcr.io/PROJECT-ID/riyal-estate --platform managed
```

**Note**: All data persists in `/data/` directory as JSON files. Ensure your deployment platform supports persistent storage for the data folder.

## Project Status

✅ **Current Version**: 2.0 (JSON Database Edition)  
✅ **Status**: Production Ready  
✅ **Last Updated**: March 2026  

### Migration from MongoDB
- ✅ All MongoDB references removed
- ✅ JSON file-based storage implemented
- ✅ All API routes updated
- ✅ Model adapters working seamlessly

## License

This project is licensed under the MIT License.

## Features Update

### Latest (2026)
- ✅ JSON-based database (no external DB needed)
- ✅ Modern amber/gold color scheme
- ✅ Enhanced UI with smooth animations
- ✅ Optimized performance
- ✅ Firebase authentication
- ✅ Cloudinary image management
- ✅ Responsive design
- ✅ Admin dashboard

## Support

For support, email support@riyalestate.com

---

Built with ❤️ by Riyal Estate Team
