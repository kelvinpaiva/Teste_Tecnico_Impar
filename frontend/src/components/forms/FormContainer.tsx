import { Paper, Stack } from '@mui/material';
import type { FormEventHandler, ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  actions?: ReactNode;
}

export function FormContainer({ children, onSubmit, actions }: FormContainerProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }} component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {children}
        {actions ? (
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            {actions}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
