import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService, dashboardService, opportunityService, vehicleService } from '../services';
import type { CustomerFormData, ListParams, OpportunityFormData, VehicleFormData } from '../types';
import { getErrorMessage } from '../utils/format';
import { useSnackbar } from './useSnackbar';

export function useVehicles(params: ListParams) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.list(params),
  });
}

export function useVehicle(id?: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehicleService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useVehicleMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: VehicleFormData) => vehicleService.create(payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Cadastro realizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VehicleFormData }) => vehicleService.update(id, payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro atualizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro removido');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  return { create, update, remove };
}

export function useCustomers(params: ListParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.list(params),
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCustomerMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['customers'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: CustomerFormData) => customerService.create(payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Cadastro realizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CustomerFormData }) => customerService.update(id, payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro atualizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => customerService.remove(id),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro removido');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  return { create, update, remove };
}

export function useOpportunities(params: ListParams) {
  return useQuery({
    queryKey: ['opportunities', params],
    queryFn: () => opportunityService.list(params),
  });
}

export function useOpportunity(id?: string) {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => opportunityService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useOpportunityMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    void queryClient.invalidateQueries({ queryKey: ['customers'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: OpportunityFormData) => opportunityService.create(payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Cadastro realizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OpportunityFormData }) =>
      opportunityService.update(id, payload),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro atualizado');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => opportunityService.remove(id),
    onSuccess: () => {
      invalidate();
      showSuccess('Registro removido');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  return { create, update, remove };
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.get(),
  });
}
