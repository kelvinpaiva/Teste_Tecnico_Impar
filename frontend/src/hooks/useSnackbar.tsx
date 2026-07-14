import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

type Severity = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<Severity>('info');

  const show = useCallback((nextMessage: string, nextSeverity: Severity) => {
    setMessage(nextMessage);
    setSeverity(nextSeverity);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      showSuccess: (msg: string) => show(msg, 'success'),
      showError: (msg: string) => show(msg, 'error'),
      showInfo: (msg: string) => show(msg, 'info'),
    }),
    [show],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={severity} variant="filled" onClose={() => setOpen(false)} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar deve ser usado dentro de SnackbarProvider');
  }
  return context;
}
