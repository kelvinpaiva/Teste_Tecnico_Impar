import type { CustomerInterest, Vehicle } from '../types';

/** Espelha a regra de Oportunidade Rápida do backend. */
export function matchesQuickOpportunity(interest: CustomerInterest, vehicle: Vehicle): boolean {
  if (vehicle.status !== 'Disponivel') {
    return false;
  }

  switch (interest) {
    case 'CarroZero':
      return vehicle.mileage === 0;
    case 'CarroUsado':
      return vehicle.mileage > 0;
    case 'SUV':
    case 'Hatch':
    case 'Sedan':
    case 'Utilitario':
      return vehicle.type === interest;
    default:
      return false;
  }
}
