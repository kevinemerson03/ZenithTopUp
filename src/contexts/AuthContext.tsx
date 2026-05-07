import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { User, Transaction } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  cart: any[];
  history: Transaction[];
  updateCart: (items: any[]) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    let userUnsub: (() => void) | undefined;
    let adminUnsub: (() => void) | undefined;
    let cartUnsub: (() => void) | undefined;
    let historyUnsub: (() => void) | undefined;

    const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up existing listeners
      if (userUnsub) userUnsub();
      if (adminUnsub) adminUnsub();
      if (cartUnsub) cartUnsub();
      if (historyUnsub) historyUnsub();

      if (firebaseUser) {
        setLoading(true); // Ensure loading is true while we fetch profile

        // Subscribe to admin status
        adminUnsub = onSnapshot(doc(db, 'admins', firebaseUser.uid), (docSnapshot) => {
          setIsAdmin(docSnapshot.exists());
        });

        // Subscribe to user profile
        userUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUser(docSnapshot.data() as User);
          } else {
            // Document doesn't exist yet (registration in progress)
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || ''
            });
          }
          setLoading(false); // Only stop loading after first snapshot
        }, (error) => {
          console.error("Profile listen error:", error);
          setLoading(false);
        });

        // Subscribe to cart
        cartUnsub = onSnapshot(doc(db, `users/${firebaseUser.uid}/cart/data`), 
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setCart(docSnapshot.data().items || []);
            } else {
              setCart([]);
            }
          },
          (error) => handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}/cart/data`)
        );

        // Subscribe to history
        const historyRef = collection(db, `users/${firebaseUser.uid}/history`);
        const historyQuery = query(historyRef, orderBy('date', 'desc'), limit(50));
        historyUnsub = onSnapshot(historyQuery,
          (snapshot) => {
            const txs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Transaction));
            setHistory(txs);
          },
          (error) => handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/history`)
        );
      } else {
        setUser(null);
        setCart([]);
        setHistory([]);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (userUnsub) userUnsub();
      if (cartUnsub) cartUnsub();
      if (historyUnsub) historyUnsub();
    };
  }, []);

  const updateCart = async (items: any[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, `users/${user.uid}/cart/data`), {
        items,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/data`);
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (!user) return;
    try {
      const historyRef = collection(db, `users/${user.uid}/history`);
      const newTxRef = doc(historyRef);
      await setDoc(newTxRef, {
        ...tx,
        date: new Date().toISOString(),
        status: tx.status || 'completed'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/history`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, cart, history, updateCart, addTransaction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
