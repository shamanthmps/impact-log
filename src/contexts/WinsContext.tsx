import React, { createContext, useContext } from 'react';
import { useWins } from '@/hooks/useWins';

type WinsContextType = ReturnType<typeof useWins>;

const WinsContext = createContext<WinsContextType | null>(null);

export function WinsProvider({ children }: { children: React.ReactNode }) {
  const winsData = useWins();

  return (
    <WinsContext.Provider value={winsData}>
      {children}
    </WinsContext.Provider>
  );
}

export function useWinsContext() {
  const context = useContext(WinsContext);
  if (!context) {
    throw new Error('useWinsContext must be used within a WinsProvider');
  }
  return context;
}
