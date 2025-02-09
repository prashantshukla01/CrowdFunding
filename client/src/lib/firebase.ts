import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { create } from "zustand";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

interface AuthUser extends User {
  firebaseUid: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user as AuthUser;
      user.firebaseUid = user.uid;
      set({ user, error: null });
    } catch (error) {
      set({ error: error as Error });
      console.error('Sign in error:', error);
    }
  },
  signOut: async () => {
    try {
      await auth.signOut();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error as Error });
      console.error('Sign out error:', error);
    }
  },
}));

// Setup auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    const authUser = user as AuthUser;
    authUser.firebaseUid = user.uid;
    useAuth.setState({ user: authUser, loading: false });
  } else {
    useAuth.setState({ user: null, loading: false });
  }
});