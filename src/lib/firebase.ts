import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;

// Only initialise Firebase when the user has filled in real config values.
// This lets the app run (with localStorage fallback) while .env is still placeholder.
const isConfigured =
  projectId &&
  !projectId.startsWith('your_') &&
  projectId.trim() !== '';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.info(
    '[Cybee] Firebase not configured — running in offline/localStorage mode.\n' +
    'Fill in VITE_FIREBASE_* values in .env and restart the dev server to enable cloud features.',
  );
}

export { auth, db };
export const firebaseReady = isConfigured;
