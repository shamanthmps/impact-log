import { useState, useEffect, useCallback } from 'react';
import { Win, WeeklyReflection } from '@/types/win';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { storageService } from '@/lib/storage';
import { STORAGE_KEYS, DATE_CONFIG } from '@/lib/constants';
import { logger } from '@/lib/logger';

// Type for raw storage data (dates are strings when serialized)
interface RawWin extends Omit<Win, 'date' | 'createdAt' | 'updatedAt'> {
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface RawReflection extends Omit<WeeklyReflection, 'weekStartDate' | 'createdAt'> {
  weekStartDate: string;
  createdAt: string;
}

/**
 * Parse dates from storage format (string) to Date objects
 */
function parseWinDates(win: RawWin): Win {
  return {
    ...win,
    date: new Date(win.date),
    createdAt: new Date(win.createdAt),
    updatedAt: new Date(win.updatedAt),
  };
}

function parseReflectionDates(reflection: RawReflection): WeeklyReflection {
  return {
    ...reflection,
    weekStartDate: new Date(reflection.weekStartDate),
    createdAt: new Date(reflection.createdAt),
  };
}

/**
 * Custom hook for managing wins and reflections data
 * Handles persistence to localStorage with error handling
 */
export function useWins() {
  const [wins, setWins] = useState<Win[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedWins = storageService.get<RawWin[]>(STORAGE_KEYS.WINS);
      if (storedWins && Array.isArray(storedWins)) {
        setWins(storedWins.map(parseWinDates));
        logger.debug(`Loaded ${storedWins.length} wins from storage`, 'useWins');
      }

      const storedReflections = storageService.get<RawReflection[]>(STORAGE_KEYS.REFLECTIONS);
      if (storedReflections && Array.isArray(storedReflections)) {
        setReflections(storedReflections.map(parseReflectionDates));
        logger.debug(`Loaded ${storedReflections.length} reflections from storage`, 'useWins');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data');
      logger.error('Error loading data from localStorage', 'useWins', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist wins to localStorage
  useEffect(() => {
    if (!isLoading) {
      const success = storageService.set(STORAGE_KEYS.WINS, wins);
      if (!success) {
        logger.warn('Failed to persist wins to storage', 'useWins');
      }
    }
  }, [wins, isLoading]);

  // Persist reflections to localStorage
  useEffect(() => {
    if (!isLoading) {
      const success = storageService.set(STORAGE_KEYS.REFLECTIONS, reflections);
      if (!success) {
        logger.warn('Failed to persist reflections to storage', 'useWins');
      }
    }
  }, [reflections, isLoading]);

  const addWin = useCallback((win: Omit<Win, 'id' | 'createdAt' | 'updatedAt'>): Win => {
    const newWin: Win = {
      ...win,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWins(prev => [newWin, ...prev]);
    logger.info('Win added', 'useWins', { id: newWin.id, category: newWin.category });
    return newWin;
  }, []);

  const updateWin = useCallback((id: string, updates: Partial<Omit<Win, 'id' | 'createdAt'>>): void => {
    setWins(prev => prev.map(win =>
      win.id === id
        ? { ...win, ...updates, updatedAt: new Date() }
        : win
    ));
    logger.info('Win updated', 'useWins', { id });
  }, []);

  const deleteWin = useCallback((id: string): void => {
    setWins(prev => prev.filter(win => win.id !== id));
    logger.info('Win deleted', 'useWins', { id });
  }, []);

  const addReflection = useCallback((reflection: Omit<WeeklyReflection, 'id' | 'createdAt'>): WeeklyReflection => {
    const newReflection: WeeklyReflection = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setReflections(prev => [newReflection, ...prev]);
    logger.info('Reflection added', 'useWins', { id: newReflection.id });
    return newReflection;
  }, []);

  // Stats calculations with memoized callbacks
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
