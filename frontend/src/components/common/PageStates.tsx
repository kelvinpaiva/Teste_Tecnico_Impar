import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, actionLabel, onAction, children }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mb: 3, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
    >
      <Box>
        <Typography variant="h5">{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {children}
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}

export function Loading() {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography color="text.secondary">Carregando...</Typography>
    </Box>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
