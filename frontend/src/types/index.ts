export type VehicleStatus = 'Disponivel' | 'Reservado' | 'Vendido';

export type VehicleType = 'SUV' | 'Hatch' | 'Sedan' | 'Utilitario';

export type OpportunityStatus =
  | 'NovoLead'
  | 'EmNegociacao'
  | 'PropostaEnviada'
  | 'Vendido'
  | 'Perdido';

export type CustomerInterest =
  | 'SUV'
  | 'Hatch'
  | 'Sedan'
  | 'Utilitario'
  | 'CarroUsado'
  | 'CarroZero';

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors: string[];
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  type: VehicleType;
  status: VehicleStatus;
  createdAt: string;
  updatedAt?: string | null;
  lastModifiedAt: string;
}

export interface VehicleDetails extends Vehicle {
  opportunitiesCount: number;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  type: VehicleType;
  status: VehicleStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  primaryInterest: CustomerInterest;
  createdAt: string;
  updatedAt?: string | null;
  lastModifiedAt: string;
  hasQuickOpportunity: boolean;
  quickOpportunityVehicleId?: string | null;
}

export interface CustomerOpportunitySummary {
  id: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  status: OpportunityStatus;
  proposedValue: number;
}

export interface CustomerDetails extends Customer {
  opportunities: CustomerOpportunitySummary[];
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  primaryInterest: CustomerInterest;
}

export interface Opportunity {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  status: OpportunityStatus;
  proposedValue: number;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  lastModifiedAt: string;
}

export interface OpportunityDetails {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePrice: number;
  status: OpportunityStatus;
  proposedValue: number;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  lastModifiedAt: string;
}

export interface OpportunityFormData {
  customerId: string;
  vehicleId: string;
  status: OpportunityStatus;
  proposedValue: number;
  notes?: string;
}

export interface StatusCountItem {
  status: string;
  count: number;
}

export interface Dashboard {
  totalVehicles: number;
  totalCustomers: number;
  totalOpportunities: number;
  vehiclesByStatus: StatusCountItem[];
  opportunitiesByStatus: StatusCountItem[];
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: string;
  type?: string;
  brand?: string;
  year?: number;
  interest?: string;
  customerId?: string;
  vehicleId?: string;
}
