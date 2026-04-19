import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AutoSaveContextType = {
  start: () => void;
  finish: (success?: boolean, errorMessage?: string) => void;
  savingCount: number;
  error?: string | null;
  lastSavedAt?: number | null;
};

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(undefined);

export const AutoSaveProvider = ({ children }: { children: ReactNode }) => {
  const [savingCount, setSavingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const start = () => {
    setError(null);
    setSavingCount((s) => s + 1);
  };

  const finish = (success = true, errorMessage?: string) => {
    setSavingCount((s) => Math.max(0, s - 1));
    if (!success) setError(errorMessage || 'Save failed');
    if (success) setLastSavedAt(Date.now());
  };

  return (
    <AutoSaveContext.Provider value={{ start, finish, savingCount, error, lastSavedAt }}>
      {children}
    </AutoSaveContext.Provider>
  );
};

export function useAutoSave() {
  const ctx = useContext(AutoSaveContext);
  if (!ctx) throw new Error('useAutoSave must be used within AutoSaveProvider');
  return ctx;
}

export default AutoSaveContext;
