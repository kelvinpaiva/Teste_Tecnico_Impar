import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextField } from '@mui/material';

interface CurrencyFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export function CurrencyField<T extends FieldValues>({ name, control, label }: CurrencyFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          value={field.value ?? ''}
          onBlur={field.onBlur}
          ref={field.ref}
          label={label}
          type="number"
          fullWidth
          slotProps={{ htmlInput: { step: '0.01', min: 0 } }}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          onChange={(event) => field.onChange(Number(event.target.value))}
        />
      )}
    />
  );
}
