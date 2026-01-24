import { useState, useEffect, useCallback } from 'react';
import { Win, WeeklyReflection } from '@/types/win';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { DATE_CONFIG, STORAGE_KEYS } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { storageService } from '@/lib/storage';

const ADMIN_EMAIL = 'shamanthcareers@gmail.com';

export function useWins() {
  const { currentUser } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isAdmin = currentUser?.email === ADMIN_EMAIL;
  const isGuest = currentUser && !isAdmin;

  // Subscribe to Wins (Firestore or LocalStorage)
  useEffect(() => {
    if (!currentUser) {
      setWins([]);
      setIsLoading(false);
      return;
    }

    if (isAdmin) {
      // PERMANENT: Firestore Sync for Admin using onSnapshot
      const q = query(
        collection(db, 'wins'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedWins = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Win;
        });
        setWins(fetchedWins);
        setIsLoading(false);
      }, (err) => {
        console.error("Error fetching wins:", err);
        setError(err);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // GUEST: Load from LocalStorage once on mount
      const storedWins = storageService.get<any[]>(STORAGE_KEYS.WINS);
      if (storedWins) {
        setWins(storedWins.map(w => ({
          ...w,
          date: new Date(w.date),
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt)
        })));
      }
      setIsLoading(false);
    }
  }, [currentUser, isAdmin]);

  // Subscribe to Reflections (Firestore or LocalStorage)
  useEffect(() => {
    if (!currentUser) {
      setReflections([]);
      return;
    }

    if (isAdmin) {
      const q = query(
        collection(db, 'reflections'),
        where('userId', '==', currentUser.uid),
        orderBy('weekStartDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedReflections = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            weekStartDate: data.weekStartDate?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
          } as WeeklyReflection;
        });
        setReflections(fetchedReflections);
      }, (err) => {
        console.error("Error fetching reflections:", err);
      });

      return () => unsubscribe();
    } else {
      const storedReflections = storageService.get<any[]>(STORAGE_KEYS.REFLECTIONS);
      if (storedReflections) {
        setReflections(storedReflections.map(r => ({
          ...r,
          weekStartDate: new Date(r.weekStartDate),
          createdAt: new Date(r.createdAt)
        })));
      }
    }
  }, [currentUser, isAdmin]);

  // Sync LocalStorage when state changes (Guest only)
  useEffect(() => {
    if (isGuest && !isLoading) {
      storageService.set(STORAGE_KEYS.WINS, wins);
    }
  }, [wins, isGuest, isLoading]);

  useEffect(() => {
    if (isGuest && !isLoading) {
      storageService.set(STORAGE_KEYS.REFLECTIONS, reflections);
    }
  }, [reflections, isGuest, isLoading]);

  const addWin = useCallback(async (winData: Omit<Win, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error("User not authenticated");

    if (isAdmin) {
      try {
        const newWin = {
          ...winData,
          userId: currentUser.uid,
          date: Timestamp.fromDate(winData.date),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'wins'), newWin);
        logger.info('Win added to Firestore', 'useWins', { id: docRef.id });
        return { ...winData, id: docRef.id };
      } catch (err) {
        logger.error('Failed to add win', 'useWins', err);
        throw err;
      }
    } else {
      // Guest Mode: Add to local state (triggers effect to save to LS)
      const newWin: Win = {
        ...winData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setWins(prev => [newWin, ...prev]); // Prepend to list
      logger.info('Win added locally (Guest)', 'useWins');
      return newWin;
    }
  }, [currentUser, isAdmin]);

  const updateWin = useCallback(async (id: string, updates: Partial<Omit<Win, 'id' | 'createdAt'>>) => {
    if (!currentUser) return;

    if (isAdmin) {
      try {
        const firestoreUpdates: any = { ...updates, updatedAt: Timestamp.now() };
        if (updates.date) firestoreUpdates.date = Timestamp.fromDate(updates.date);
        await updateDoc(doc(db, 'wins', id), firestoreUpdates);
        logger.info('Win updated Firestore', 'useWins', { id });
      } catch (err) {
        logger.error('Failed to update win', 'useWins', err);
        throw err;
      }
    } else {
      setWins(prev => prev.map(win =>
        win.id === id
          ? { ...win, ...updates, updatedAt: new Date() }
          : win
      ));
    }
  }, [currentUser, isAdmin]);

  const deleteWin = useCallback(async (id: string) => {
    if (!currentUser) return;

    if (isAdmin) {
      try {
        await deleteDoc(doc(db, 'wins', id));
        logger.info('Win deleted Firestore', 'useWins', { id });
      } catch (err) {
        logger.error('Failed to delete win', 'useWins', err);
        throw err;
      }
    } else {
      setWins(prev => prev.filter(win => win.id !== id));
    }
  }, [currentUser, isAdmin]);

  const addReflection = useCallback(async (reflectionData: Omit<WeeklyReflection, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error("User not authenticated");

    if (isAdmin) {
      try {
        const newReflection = {
          ...reflectionData,
          userId: currentUser.uid,
          weekStartDate: Timestamp.fromDate(reflectionData.weekStartDate),
          createdAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'reflections'), newReflection);
        return { ...reflectionData, id: docRef.id };
      } catch (err) {
        logger.error('Failed to add reflection', 'useWins', err);
        throw err;
      }
    } else {
      const newReflection: WeeklyReflection = {
        ...reflectionData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      setReflections(prev => [newReflection, ...prev]);
      return newReflection;
    }
  }, [currentUser, isAdmin]);

  // Stats calculations (CLIENT SIDE for now, based on synced data)
  const getWinsThisWeek = useCallback((): number => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: DATE_CONFIG.WEEK_STARTS_ON });
    const weekEnd = endOfWeek(now, { weekStartsOn: DATE_CONFIG.WEEK_STARTS_ON });
    return wins.filter(win =>
      isWithinInterval(win.date, { start: weekStart, end: weekEnd })
    ).length;
  }, [wins]);

  const getWinsThisMonth = useCallback((): number => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return wins.filter(win =>
      isWithinInterval(win.date, { start: monthStart, end: monthEnd })
    ).length;
  }, [wins]);

  const getCategoriesCovered = useCallback((): number => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthWins = wins.filter(win =>
      isWithinInterval(win.date, { start: monthStart, end: monthEnd })
    );
    return new Set(monthWins.map(w => w.category)).size;
  }, [wins]);

  const getWinsByDateRange = useCallback((start: Date, end: Date): Win[] => {
    return wins.filter(win =>
      isWithinInterval(win.date, { start, end })
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [wins]);

  return {
    wins,
    reflections,
    isLoading,
    error,
    addWin,
    updateWin,
    deleteWin,
    addReflection,
    getWinsThisWeek,
    getWinsThisMonth,
    getCategoriesCovered,
    getWinsByDateRange,
    isGuest
  };
}
