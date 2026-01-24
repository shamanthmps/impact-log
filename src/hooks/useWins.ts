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
import { DATE_CONFIG } from '@/lib/constants';
import { logger } from '@/lib/logger';

export function useWins() {
  const { currentUser } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to Wins
  useEffect(() => {
    if (!currentUser) {
      setWins([]);
      setIsLoading(false);
      return;
    }

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
  }, [currentUser]);

  // Subscribe to Reflections
  useEffect(() => {
    if (!currentUser) {
      setReflections([]);
      return;
    }

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
  }, [currentUser]);

  const addWin = useCallback(async (winData: Omit<Win, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error("User not authenticated");

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
  }, [currentUser]);

  const updateWin = useCallback(async (id: string, updates: Partial<Omit<Win, 'id' | 'createdAt'>>) => {
    if (!currentUser) return;
    try {
      // Convert Date objects to Timestamps if present
      const firestoreUpdates: any = { ...updates, updatedAt: Timestamp.now() };
      if (updates.date) firestoreUpdates.date = Timestamp.fromDate(updates.date);

      await updateDoc(doc(db, 'wins', id), firestoreUpdates);
      logger.info('Win updated', 'useWins', { id });
    } catch (err) {
      logger.error('Failed to update win', 'useWins', err);
      throw err;
    }
  }, [currentUser]);

  const deleteWin = useCallback(async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'wins', id));
      logger.info('Win deleted', 'useWins', { id });
    } catch (err) {
      logger.error('Failed to delete win', 'useWins', err);
      throw err;
    }
  }, [currentUser]);

  const addReflection = useCallback(async (reflectionData: Omit<WeeklyReflection, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error("User not authenticated");
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
  }, [currentUser]);

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
  };
}
