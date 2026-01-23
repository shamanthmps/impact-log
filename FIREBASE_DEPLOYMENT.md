# Firebase Deployment Guide

This guide will help you deploy your Impact Log application to Firebase Hosting with Firestore and Firebase Authentication.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** installed globally
3. **A Firebase project** created in the [Firebase Console](https://console.firebase.google.com/)

---

## Step 1: Firebase Project Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter your project name (e.g., `impact-log`)
4. Follow the prompts to create your project

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. (Optional) Enable **Google** provider:
   - Click on Google
   - Toggle Enable
   - Add your project support email
   - Click Save

### 1.3 Enable Firestore

1. In Firebase Console, go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** (our rules file will handle security)
4. Select a location close to your users
5. Click **Enable**

### 1.4 Register Your Web App

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., `impact-log-web`)
5. Copy the Firebase configuration object

---

## Step 2: Configure Environment Variables

### 2.1 Create `.env.local` file

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

### 2.2 Add Your Firebase Config

Edit `.env.local` and fill in your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

---

## Step 3: Firebase CLI Setup

### 3.1 Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase

```bash
npm run firebase:login
# OR
firebase login
```

This will open a browser window for authentication.

### 3.3 Connect to Your Project

```bash
firebase use --add
```

Select your Firebase project from the list.

---

## Step 4: Deploy

### 4.1 Full Deployment (Hosting + Firestore Rules)

```bash
npm run firebase:deploy
```

This command will:
1. Build your application for production
2. Deploy static files to Firebase Hosting
3. Deploy Firestore security rules

### 4.2 Deploy Only Hosting

```bash
npm run firebase:deploy:hosting
```

### 4.3 Deploy Only Firestore Rules

```bash
npm run firebase:deploy:firestore
```

---

## Step 5: Verify Deployment

After deployment, Firebase will provide you with a hosting URL:

```
✔ Deploy complete!

Hosting URL: https://your-project-id.web.app
```

Visit this URL to verify your application is working correctly.

---

## Project Structure

```
impact-log/
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── AuthForm.tsx        # Login/Signup form
│   │       ├── ProtectedRoute.tsx  # Route protection
│   │       └── UserProfile.tsx     # User dropdown menu
│   ├── contexts/
│   │   └── AuthContext.tsx         # Firebase Auth context
│   └── lib/
│       └── firebase.ts             # Firebase configuration
├── .env.example                     # Environment template
├── firebase.json                    # Firebase hosting config
├── firestore.rules                  # Firestore security rules
└── firestore.indexes.json          # Firestore indexes
```

---

## Authentication Features

The following authentication methods are configured:

- ✅ **Email/Password** - Traditional signup and login
- ✅ **Google OAuth** - One-click Google sign-in
- ✅ **Password Reset** - Email-based password recovery

### Using Authentication in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout, signup, loginWithGoogle } = useAuth();

  if (!currentUser) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {currentUser.displayName}!</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// In your router:
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## Firestore Usage

### Reading Data

```tsx
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Get all documents in a collection
const querySnapshot = await getDocs(collection(db, 'users'));
querySnapshot.forEach((doc) => {
  console.log(doc.id, ' => ', doc.data());
});

// Get a single document
const docRef = doc(db, 'users', 'userId');
const docSnap = await getDoc(docRef);
```

### Writing Data

```tsx
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

// Add a new document with auto-generated ID
const docRef = await addDoc(collection(db, 'users'), {
  name: 'John Doe',
  email: 'john@example.com'
});

// Set a document with a specific ID
await setDoc(doc(db, 'users', 'userId'), {
  name: 'John Doe',
  email: 'john@example.com'
});

// Update specific fields
await updateDoc(doc(db, 'users', 'userId'), {
  name: 'Jane Doe'
});
```

---

## Security Rules

The `firestore.rules` file contains security rules for Firestore. Current rules:

- **users/{userId}**: Authenticated users can read all users; users can only write their own data
- **public/{document}**: Anyone can read; only authenticated users can write
- **userPrivate/{userId}**: Only the owner can read/write

Customize these rules based on your application's needs.

---

## Troubleshooting

### Common Issues

1. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Ensure `.env.local` is properly configured
   - Restart your development server after adding env variables

2. **"Permission denied" in Firestore**
   - Check your Firestore security rules
   - Ensure the user is authenticated before accessing protected data

3. **Google Sign-in popup blocked**
   - Allow popups for your domain
   - Ensure your domain is authorized in Firebase Console

4. **Build fails before deployment**
   - Run `npm run build` locally first to identify errors
   - Fix any TypeScript or ESLint errors

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)

---

## Optional: Custom Domain

To connect a custom domain:

1. Go to Firebase Console > Hosting
2. Click **"Add custom domain"**
3. Follow the DNS verification steps

---

## Environment Variables for CI/CD

For GitHub Actions or other CI/CD pipelines, add these as repository secrets:

```yaml
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
FIREBASE_TOKEN  # Get this with: firebase login:ci
```
