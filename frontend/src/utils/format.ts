export const vehicleStatusLabels: Record<string, string> = {
  Disponivel: 'Disponível',
  Reservado: 'Reservado',
  Vendido: 'Vendido',
};

export const opportunityStatusLabels: Record<string, string> = {
  NovoLead: 'Novo Lead',
  EmNegociacao: 'Em Negociação',
  PropostaEnviada: 'Proposta Enviada',
  Vendido: 'Vendido',
  Perdido: 'Perdido',
};

export const customerInterestLabels: Record<string, string> = {
  SUV: 'SUV',
  Hatch: 'Hatch',
  Sedan: 'Sedan',
  Utilitario: 'Utilitário',
  CarroUsado: 'Carro Usado',
  CarroZero: 'Carro Zero',
};

/** Tipos de veículo (Interesse Principal sem Carro Usado / Carro Zero). */
export const vehicleTypeLabels: Record<string, string> = {
  SUV: 'SUV',
  Hatch: 'Hatch',
  Sedan: 'Sedan',
  Utilitario: 'Utilitário',
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));

export const getErrorMessage = (error: unknown, fallback = 'Erro inesperado.'): string => {
  if (typeof error === 'object' && error !== null && 'friendlyMessage' in error) {
    return String((error as { friendlyMessage: string }).friendlyMessage);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
