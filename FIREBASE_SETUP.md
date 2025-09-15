# Firebase Setup - Complete Integration

This project now uses Firebase for complete backend functionality including:
- **Authentication**: Email/password, Google login, and phone number authentication
- **Database**: Firestore for storing movies, users, and analytics data
- **Storage**: Firebase Storage for movie posters and video files
- **Admin Panel**: Full CRUD operations for content and user management

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "lindafashions")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and enable "Email/Password"
   - **Google**: Click on it and enable it, add your project support email
   - **Phone**: Click on it and enable it

#### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

#### Storage
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select the same location as your Firestore database

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Add Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

### 5. Configure Phone Authentication

1. In Firebase Console, go to Authentication > Settings
2. In the "Phone numbers for testing" section, you can add test phone numbers:
   - Add phone numbers like `+1 650-555-3434`
   - Add corresponding verification codes like `654321`
   - This allows testing without sending real SMS messages

### 6. Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Add your domains to "Authorized domains":
   - `localhost` (for development)
   - Your production domain (e.g., `yourdomain.com`)

### 7. Test the Authentication

1. Start your development server: `npm run dev`
2. Go to `/login` page
3. Try creating a new account with email/password
4. Try logging in with Google
5. Try phone authentication with test numbers
6. Check Firebase Console > Authentication > Users to see registered users

## Features Implemented

### ✅ Authentication System
- **Email/Password**: User registration and login with validation
- **Google Authentication**: One-click Google login with automatic account creation
- **Phone Authentication**: SMS verification with reCAPTCHA protection
- **Password Reset**: Email-based password reset functionality
- **User State Management**: Persistent login sessions and secure logout

### ✅ Database Integration (Firestore)
- **Movies Collection**: Store movie/series data with metadata
- **Users Collection**: User profiles with roles and subscription info
- **Real-time Updates**: Automatic data synchronization
- **CRUD Operations**: Full create, read, update, delete functionality

### ✅ File Storage (Firebase Storage)
- **Movie Posters**: Upload and store poster images (up to 5MB)
- **Video Files**: Upload and store movie/series videos (up to 500MB)
- **File Management**: Automatic file deletion when content is removed
- **URL Generation**: Secure download URLs for media files

### ✅ Admin Panel Features
- **Content Management**: Add, edit, delete movies and series
- **User Management**: View and manage user accounts and subscriptions
- **Analytics Dashboard**: View platform statistics and performance metrics
- **File Upload**: Drag-and-drop interface for poster and video uploads
- **Real-time Data**: Live updates from Firestore database

### ✅ Error Handling & UX
- **Comprehensive Error Messages**: User-friendly error notifications
- **Loading States**: Visual feedback during operations
- **File Validation**: Type and size validation for uploads
- **Responsive Design**: Works on all device sizes

## Security Features

- Firebase handles all authentication security
- Secure password hashing
- CSRF protection
- Rate limiting for failed attempts
- Secure token management

## Admin Access

To create an admin user:
1. Register a user with email `admin@luoancient.com`
2. The system will automatically assign admin role
3. Admin users have access to admin panel at `/admin`

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your environment variables are correctly set
   - Restart your development server after adding env vars

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Email/Password authentication in Firebase Console
   - Enable Google authentication if using Google login

3. **"Firebase: Error (auth/invalid-api-key)"**
   - Verify your API key in the environment variables
   - Make sure you're using the correct project's API key

4. **Google Login Popup Blocked**
   - Allow popups for your domain
   - Check if ad blockers are interfering

### Development vs Production

- Use different Firebase projects for development and production
- Update environment variables for production deployment
- Configure authorized domains for your production domain

## Database Schema

### Movies Collection (`movies`)
```javascript
{
  id: string,                    // Auto-generated document ID
  title: string,                 // Movie/series title
  description: string,           // Detailed description
  genre: string,                 // Genre (Action, Drama, etc.)
  duration: string,              // Duration (e.g., "2h 15m" or "8 episodes")
  rating: number,                // Rating (1-5)
  poster: string,                // Poster image URL
  videoUrl?: string,             // Video file URL (optional)
  type: "movie" | "series",      // Content type
  status: "active" | "inactive", // Publication status
  views: number,                 // View count
  revenue: number,               // Revenue generated
  createdAt: Timestamp,          // Creation timestamp
  updatedAt: Timestamp,          // Last update timestamp
  createdBy: string              // Admin user ID who created it
}
```

### Users Collection (`users`)
```javascript
{
  id: string,                    // Firebase Auth UID
  name: string,                  // User's display name
  email: string,                 // User's email address
  role: "user" | "admin",        // User role
  status: "active" | "inactive", // Account status
  subscription?: {               // Subscription info (optional)
    plan: string,                // Subscription plan name
    expiresAt: Timestamp,        // Expiration date
    isActive: boolean            // Whether subscription is active
  },
  createdAt: Timestamp,          // Account creation date
  lastActive: Timestamp          // Last activity timestamp
}
```

## Storage Structure

### File Organization
```
/movies/
  /{movieId}/
    /poster/
      - poster.jpg
    /video/
      - movie.mp4
```

## Admin Access

To create an admin user:
1. Register a user with email `admin@luoancient.com`
2. The system will automatically assign admin role
3. Admin users have access to admin panel at `/admin`

## Next Steps

1. **Set up your Firebase project** with all required services
2. **Add the environment variables** to `.env.local`
3. **Test the authentication flow** with demo accounts
4. **Upload test content** through the admin panel
5. **Configure production settings** for deployment

The complete Firebase integration is now ready with:
- ✅ User authentication and management
- ✅ Movie/series content management
- ✅ File upload and storage
- ✅ Real-time database operations
- ✅ Admin panel with full CRUD functionality

Your Luo Ancient Movies platform is now fully functional with Firebase backend!
