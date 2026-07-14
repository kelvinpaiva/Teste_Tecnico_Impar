import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B3D60',
      light: '#1F6AA5',
      dark: '#072A42',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8A838',
      light: '#F0C56A',
      dark: '#B87E1C',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#F4F7FA',
      paper: '#FFFFFF',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    info: { main: '#0288D1' },
    text: {
      primary: '#1C2430',
      secondary: '#5A6A7A',
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
