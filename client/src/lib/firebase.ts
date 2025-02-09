import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { create } from "zustand";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export interface AuthUser extends User {
  firebaseUid: string;
}

export const useAuth = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user: AuthUser | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: any) => set({ error }),
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user as AuthUser;
      user.firebaseUid = user.uid;
      set({ user, loading: false, error: null });
    } catch (error) {
      console.error('Sign in error:', error);
      set({ error: error as Error, loading: false });
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user as AuthUser;
      user.firebaseUid = user.uid;
      set({ user, loading: false, error: null });
    } catch (error) {
      console.error('Sign up error:', error);
      set({ error: error as Error, loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error as Error, loading: false });
    }
  },
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuth.getState().setLoading(false);
  useAuth.getState().setUser(user as AuthUser | null);
});