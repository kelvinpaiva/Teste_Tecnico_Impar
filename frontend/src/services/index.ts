import api from '../api/api';
import type {
  Customer,
  CustomerDetails,
  CustomerFormData,
  Dashboard,
  ListParams,
  Opportunity,
  OpportunityDetails,
  OpportunityFormData,
  PagedResponse,
  Vehicle,
  VehicleDetails,
  VehicleFormData,
} from '../types';

const toQuery = (params: ListParams) => {
  const query: Record<string, string | number> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  });
  return query;
};

export const vehicleService = {
  list: async (params: ListParams) => {
    const { data } = await api.get<PagedResponse<Vehicle>>('/vehicles', { params: toQuery(params) });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<VehicleDetails>(`/vehicles/${id}`);
    return data;
  },
  create: async (payload: VehicleFormData) => {
    const { data } = await api.post<Vehicle>('/vehicles', payload);
    return data;
  },
  update: async (id: string, payload: VehicleFormData) => {
    const { data } = await api.put<Vehicle>(`/vehicles/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/vehicles/${id}`);
  },
};

export const customerService = {
  list: async (params: ListParams) => {
    const { data } = await api.get<PagedResponse<Customer>>('/customers', { params: toQuery(params) });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<CustomerDetails>(`/customers/${id}`);
    return data;
  },
  create: async (payload: CustomerFormData) => {
    const { data } = await api.post<Customer>('/customers', payload);
    return data;
  },
  update: async (id: string, payload: CustomerFormData) => {
    const { data } = await api.put<Customer>(`/customers/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/customers/${id}`);
  },
};

export const opportunityService = {
  list: async (params: ListParams) => {
    const { data } = await api.get<PagedResponse<Opportunity>>('/opportunities', { params: toQuery(params) });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<OpportunityDetails>(`/opportunities/${id}`);
    return data;
  },
  create: async (payload: OpportunityFormData) => {
    const { data } = await api.post<Opportunity>('/opportunities', payload);
    return data;
  },
  update: async (id: string, payload: OpportunityFormData) => {
    const { data } = await api.put<Opportunity>(`/opportunities/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/opportunities/${id}`);
  },
};

export const dashboardService = {
  get: async () => {
    const { data } = await api.get<Dashboard>('/dashboard');
    return data;
  },
};
