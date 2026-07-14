import { Chip } from '@mui/material';
import {
  customerInterestLabels,
  opportunityStatusLabels,
  vehicleStatusLabels,
} from '../../utils/format';

const vehicleColors: Record<string, 'success' | 'warning' | 'default'> = {
  Disponivel: 'success',
  Reservado: 'warning',
  Vendido: 'default',
};

const opportunityColors: Record<string, 'info' | 'warning' | 'success' | 'error' | 'default'> = {
  NovoLead: 'info',
  EmNegociacao: 'warning',
  PropostaEnviada: 'default',
  Vendido: 'success',
  Perdido: 'error',
};

export function VehicleStatusChip({ status }: { status: string }) {
  return <Chip size="small" label={vehicleStatusLabels[status] ?? status} color={vehicleColors[status] ?? 'default'} />;
}

export function OpportunityStatusChip({ status }: { status: string }) {
  return (
    <Chip
      size="small"
      label={opportunityStatusLabels[status] ?? status}
      color={opportunityColors[status] ?? 'default'}
    />
  );
}

export function InterestChip({ interest }: { interest: string }) {
  return <Chip size="small" label={customerInterestLabels[interest] ?? interest} variant="outlined" />;
}
