import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { auth, db, firebaseReady } from '@/lib/firebase';
import { hashPassword, generateId } from '@/utils/crypto';
import type { User } from '@/types';

// ── localStorage fallback (used when Firebase is not yet configured) ─────────
const USERS_KEY = 'cybee_users';
const CURRENT_USER_KEY = 'cybee_current_user';

interface StoredUser extends User { passwordHash: string; }

function getLocalUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}
function saveLocalUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getLocalCurrentUser(): User | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}
function saveLocalCurrentUser(user: User | null) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

// ── Auth context ──────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAppUser(fbUser: FirebaseUser, createdAt?: number): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? fbUser.email ?? 'User',
    email: fbUser.email ?? '',
    createdAt: createdAt ?? Date.now(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (firebaseReady && auth) {
      // Firebase path: listen to auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser && db) {
          try {
            const snap = await getDoc(doc(db, 'users', fbUser.uid));
            const createdAt = snap.exists() ? (snap.data().createdAt as number) : Date.now();
            setUser(toAppUser(fbUser, createdAt));
          } catch {
            setUser(toAppUser(fbUser));
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      // localStorage fallback path
      setUser(getLocalCurrentUser());
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (firebaseReady && auth) {
        // ── Firebase login ──────────────────────────────────────────────────
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const createdAt = db
          ? await getDoc(doc(db, 'users', credential.user.uid))
            .then(s => s.exists() ? (s.data().createdAt as number) : Date.now())
          : Date.now();
        const appUser = toAppUser(credential.user, createdAt);
        setUser(appUser);
        toast.success('Welcome back!', { description: `Logged in as ${appUser.name}` });
        return true;
      } else {
        // ── localStorage login ──────────────────────────────────────────────
        const passwordHash = await hashPassword(password);
        const users = getLocalUsers();
        const found = users.find(u => u.email === email && u.passwordHash === passwordHash);
        if (found) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordHash: _omit, ...appUser } = found;
          setUser(appUser);
          saveLocalCurrentUser(appUser);
          toast.success('Welcome back!', { description: `Logged in as ${found.name}` });
          return true;
        }
        toast.error('Invalid credentials', { description: 'Please check your email and password' });
        return false;
      }
    } catch (error: unknown) {
      console.error('[Auth] Login error:', error);
      const code = (error as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        toast.error('Invalid credentials', { description: 'Please check your email and password' });
      } else if (code === 'auth/operation-not-allowed') {
        toast.error('Auth not enabled', { description: 'Email/Password sign-in must be enabled in the Firebase console' });
      } else if (code === 'auth/network-request-failed') {
        toast.error('Network error', { description: 'Check your internet connection and try again' });
      } else {
        toast.error('Login failed', { description: code || 'Please try again' });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (firebaseReady && auth) {
        // ── Firebase register ───────────────────────────────────────────────
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        const createdAt = Date.now();
        if (db) {
          await setDoc(doc(db, 'users', credential.user.uid), {
            name, email, createdAt, createdAtServer: serverTimestamp(),
          });
        }
        setUser(toAppUser(credential.user, createdAt));
        toast.success('Account created!', { description: 'Welcome to Cybee' });
        return true;
      } else {
        // ── localStorage register ───────────────────────────────────────────
        const users = getLocalUsers();
        if (users.some(u => u.email === email)) {
          toast.error('Email already registered', { description: 'Please use a different email or login' });
          return false;
        }
        const passwordHash = await hashPassword(password);
        const newUser: StoredUser = { id: generateId(), name, email, createdAt: Date.now(), passwordHash };
        users.push(newUser);
        saveLocalUsers(users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _omit, ...appUser } = newUser;
        setUser(appUser);
        saveLocalCurrentUser(appUser);
        toast.success('Account created!', { description: 'Welcome to Cybee' });
        return true;
      }
    } catch (error: unknown) {
      console.error('[Auth] Register error:', error);
      const code = (error as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') {
        toast.error('Email already registered', { description: 'Please use a different email or login' });
      } else if (code === 'auth/weak-password') {
        toast.error('Weak password', { description: 'Password must be at least 6 characters' });
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        toast.error('Firebase Auth not set up', { description: 'Go to Firebase console → Authentication → Get started, then enable Email/Password' });
      } else if (code === 'auth/network-request-failed') {
        toast.error('Network error', { description: 'Check your internet connection and try again' });
      } else {
        toast.error('Registration failed', { description: code || 'Please try again' });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (firebaseReady && auth) {
      await signOut(auth);
    } else {
      saveLocalCurrentUser(null);
    }
    setUser(null);
    toast.info('Logged out', { description: 'See you soon!' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
