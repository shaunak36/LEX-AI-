import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Standard' | 'Viewer';
  avatar?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore to get role and name
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name || firebaseUser.displayName || 'User',
            role: userData.role || 'Standard',
            avatar: userData.avatar,
          });
        } else {
          // If the user document doesn't exist, this might be the very first user (make them Super Admin)
          // Or a new user that registered. We will handle user creation in the Login/Register component, 
          // but as a fallback, create standard user here if somehow missed.
          const isFirstUser = (await getDoc(doc(db, 'system', 'config'))).exists() === false;
          
          if (isFirstUser) {
             // Just a basic fallback, ideally Register handles this.
          }
          
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'Standard',
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Session Timeout Logic (30 minutes)
  useEffect(() => {
    let timeoutWarningTimer: NodeJS.Timeout;
    let logoutTimer: NodeJS.Timeout;

    const resetTimers = () => {
      if (!currentUser) return;
      
      clearTimeout(timeoutWarningTimer);
      clearTimeout(logoutTimer);

      // Warning at 25 minutes
      timeoutWarningTimer = setTimeout(() => {
        toast('Your session will expire in 5 minutes due to inactivity.', { icon: '⚠️' });
      }, 25 * 60 * 1000);

      // Logout at 30 minutes
      logoutTimer = setTimeout(() => {
        toast.error('Session expired due to inactivity.');
        signOut(auth);
      }, 30 * 60 * 1000);
    };

    if (currentUser) {
      resetTimers();
      window.addEventListener('mousemove', resetTimers);
      window.addEventListener('keydown', resetTimers);
    }

    return () => {
      clearTimeout(timeoutWarningTimer);
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('keydown', resetTimers);
    };
  }, [currentUser]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
