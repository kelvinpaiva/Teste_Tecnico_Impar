import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from './hooks/useSnackbar';
import { AppRoutes } from './routes/AppRoutes';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
