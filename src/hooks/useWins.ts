import { useState, useEffect, useCallback } from 'react';
import { Win, WeeklyReflection } from '@/types/win';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const WINS_STORAGE_KEY = 'impactlog-wins';
const REFLECTIONS_STORAGE_KEY = 'impactlog-reflections';

export function useWins() {
  const [wins, setWins] = useState<Win[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedWins = localStorage.getItem(WINS_STORAGE_KEY);
      if (storedWins) {
        const parsed = JSON.parse(storedWins);
        setWins(parsed.map((w: Win) => ({
          ...w,
          date: new Date(w.date),
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
        })));
      }

      const storedReflections = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
      if (storedReflections) {
        const parsed = JSON.parse(storedReflections);
        setReflections(parsed.map((r: WeeklyReflection) => ({
          ...r,
          weekStartDate: new Date(r.weekStartDate),
          createdAt: new Date(r.createdAt),
        })));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist wins to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(WINS_STORAGE_KEY, JSON.stringify(wins));
    }
  }, [wins, isLoading]);

  // Persist reflections to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(reflections));
    }
  }, [reflections, isLoading]);

  const addWin = useCallback((win: Omit<Win, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWin: Win = {
      ...win,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWins(prev => [newWin, ...prev]);
    return newWin;
  }, []);

  const updateWin = useCallback((id: string, updates: Partial<Omit<Win, 'id' | 'createdAt'>>) => {
    setWins(prev => prev.map(win => 
      win.id === id 
        ? { ...win, ...updates, updatedAt: new Date() }
        : win
    ));
  }, []);

  const deleteWin = useCallback((id: string) => {
    setWins(prev => prev.filter(win => win.id !== id));
  }, []);

  const addReflection = useCallback((reflection: Omit<WeeklyReflection, 'id' | 'createdAt'>) => {
    const newReflection: WeeklyReflection = {
      ...reflection,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setReflections(prev => [newReflection, ...prev]);
    return newReflection;
  }, []);

  // Stats calculations
  const getWinsThisWeek = useCallback(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    return wins.filter(win => 
      isWithinInterval(win.date, { start: weekStart, end: weekEnd })
    ).length;
  }, [wins]);

  const getWinsThisMonth = useCallback(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return wins.filter(win => 
      isWithinInterval(win.date, { start: monthStart, end: monthEnd })
    ).length;
  }, [wins]);

  const getCategoriesCovered = useCallback(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthWins = wins.filter(win => 
      isWithinInterval(win.date, { start: monthStart, end: monthEnd })
    );
    return new Set(monthWins.map(w => w.category)).size;
  }, [wins]);

  const getWinsByDateRange = useCallback((start: Date, end: Date) => {
    return wins.filter(win => 
      isWithinInterval(win.date, { start, end })
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [wins]);

  return {
    wins,
    reflections,
    isLoading,
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
