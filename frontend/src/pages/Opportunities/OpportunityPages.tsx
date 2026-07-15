import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ErrorMessage, Loading, PageHeader } from '../../components/common/PageStates';
import { SearchBar } from '../../components/common/SearchBar';
import { OpportunityStatusChip } from '../../components/common/StatusChip';
import { CurrencyField } from '../../components/forms/CurrencyField';
import { FormContainer } from '../../components/forms/FormContainer';
import { DataTable, type Column } from '../../components/tables/DataTable';
import {
  useCustomers,
  useOpportunities,
  useOpportunity,
  useOpportunityMutations,
  useVehicles,
} from '../../hooks/useCrmQueries';
import type { Opportunity, OpportunityFormData, OpportunityStatus, Vehicle } from '../../types';
import { formatCurrency, formatDate, getErrorMessage, opportunityStatusLabels } from '../../utils/format';
import { matchesQuickOpportunity } from '../../utils/quickOpportunity';
import { cycleSortState, getLastModifiedAt } from '../../utils/sort';

const opportunitySchema = z.object({
  customerId: z.string().uuid('Selecione um cliente'),
  vehicleId: z.string().uuid('Selecione um veículo'),
  status: z.enum(['NovoLead', 'EmNegociacao', 'PropostaEnviada', 'Vendido', 'Perdido']),
  proposedValue: z.number().positive('Valor deve ser maior que zero'),
  notes: z.string().max(2000).optional(),
});

export function OpportunityListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('lastModifiedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const customersQuery = useCustomers({ page: 1, pageSize: 100 });
  const vehiclesQuery = useVehicles({ page: 1, pageSize: 100 });
  const { data, isLoading, isError, error } = useOpportunities({
    page,
    pageSize,
    search,
    status,
    customerId,
    vehicleId,
    sortBy,
    sortDirection,
  });
  const { remove } = useOpportunityMutations();

  const columns: Column<Opportunity>[] = useMemo(
    () => [
      {
        id: 'customer',
        label: 'Cliente',
        sortable: true,
        render: (row) => row.customerName,
      },
      {
        id: 'vehicle',
        label: 'Veículo',
        sortable: true,
        render: (row) => `${row.vehicleBrand} ${row.vehicleModel}`,
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => <OpportunityStatusChip status={row.status} />,
      },
      {
        id: 'proposedValue',
        label: 'Valor',
        sortable: true,
        render: (row) => formatCurrency(row.proposedValue),
      },
      {
        id: 'lastModifiedAt',
        label: 'Criação/Atualização',
        sortable: true,
        render: (row) => formatDate(getLastModifiedAt(row)),
      },
      {
        id: 'actions',
        label: 'Ações',
        render: (row) => (
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => navigate(`/opportunities/${row.id}`)}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/opportunities/${row.id}/edit`)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [navigate],
  );

  return (
    <>
      <PageHeader
        title="Oportunidades"
        subtitle="Gestão do funil de vendas"
        actionLabel="Nova oportunidade"
        onAction={() => navigate('/opportunities/new')}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Buscar por cliente, veículo ou observações"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(opportunityStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Cliente"
            value={customerId}
            onChange={(event) => {
              setCustomerId(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {(customersQuery.data?.items ?? []).map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Veículo"
            value={vehicleId}
            onChange={(event) => {
              setVehicleId(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {(vehiclesQuery.data?.items ?? []).map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {isError ? <ErrorMessage message={getErrorMessage(error)} /> : null}

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        loading={isLoading}
        page={page}
        pageSize={pageSize}
        totalItems={data?.totalItems ?? 0}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onSortChange={(column) => {
          const next = cycleSortState({ sortBy, sortDirection }, column);
          setSortBy(next.sortBy);
          setSortDirection(next.sortDirection);
        }}
        getRowId={(row) => row.id}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Excluir oportunidade"
        description="Tem certeza que deseja excluir esta oportunidade?"
        loading={remove.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          remove.mutate(deleteId, { onSettled: () => setDeleteId(null) });
        }}
      />
    </>
  );
}

function OpportunityForm({
  defaultValues,
  onSubmit,
  submitting,
  fromQuickOpportunity = false,
}: {
  defaultValues: OpportunityFormData;
  onSubmit: (values: OpportunityFormData) => void;
  submitting: boolean;
  fromQuickOpportunity?: boolean;
}) {
  const navigate = useNavigate();
  const customersQuery = useCustomers({ page: 1, pageSize: 100 });
  const vehiclesQuery = useVehicles({ page: 1, pageSize: 100 });
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues,
  });

  const selectedCustomerId = useWatch({ control, name: 'customerId' });
  const selectedVehicleId = useWatch({ control, name: 'vehicleId' });

  const selectedCustomer = useMemo(
    () => (customersQuery.data?.items ?? []).find((customer) => customer.id === selectedCustomerId),
    [customersQuery.data?.items, selectedCustomerId],
  );

  const vehicleOptions = useMemo(() => {
    const vehicles = vehiclesQuery.data?.items ?? [];
    return vehicles.filter(
      (vehicle) => vehicle.status !== 'Vendido' || vehicle.id === selectedVehicleId,
    );
  }, [vehiclesQuery.data?.items, selectedVehicleId]);

  const recommendedVehicles = useMemo(() => {
    if (!selectedCustomer || !fromQuickOpportunity) {
      return new Set<string>();
    }

    return new Set(
      vehicleOptions
        .filter((vehicle) => matchesQuickOpportunity(selectedCustomer.primaryInterest, vehicle))
        .map((vehicle) => vehicle.id),
    );
  }, [fromQuickOpportunity, selectedCustomer, vehicleOptions]);

  const renderVehicleLabel = (vehicle: Vehicle) => {
    const isRecommended = recommendedVehicles.has(vehicle.id);
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {isRecommended ? (
          <Box
            component="span"
            aria-hidden
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'success.main',
              flexShrink: 0,
            }}
          />
        ) : null}
        <Typography component="span" variant="body2">
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </Typography>
      </Stack>
    );
  };

  return (
    <FormContainer
      onSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <Button onClick={() => navigate('/opportunities')}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Salvar
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        {fromQuickOpportunity ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success" variant="outlined">
              O círculo verde antes do nome do veículo indica carros que atendem à Recomendação
              Rápida para o cliente selecionado.
            </Alert>
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Cliente"
                fullWidth
                {...field}
                error={Boolean(errors.customerId)}
                helperText={errors.customerId?.message}
              >
                {(customersQuery.data?.items ?? []).map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Veículo"
                fullWidth
                {...field}
                error={Boolean(errors.vehicleId)}
                helperText={errors.vehicleId?.message}
                slotProps={{
                  select: {
                    renderValue: (value) => {
                      const vehicle = vehicleOptions.find((item) => item.id === value);
                      if (!vehicle) return '';
                      return renderVehicleLabel(vehicle);
                    },
                  },
                }}
              >
                {vehicleOptions.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {renderVehicleLabel(vehicle)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Status"
                fullWidth
                {...field}
                error={Boolean(errors.status)}
                helperText={errors.status?.message}
              >
                {(Object.keys(opportunityStatusLabels) as OpportunityStatus[]).map((value) => (
                  <MenuItem key={value} value={value}>
                    {opportunityStatusLabels[value]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrencyField name="proposedValue" control={control} label="Valor proposto" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Observações"
            fullWidth
            multiline
            minRows={3}
            {...register('notes')}
            error={Boolean(errors.notes)}
            helperText={errors.notes?.message}
          />
        </Grid>
      </Grid>
    </FormContainer>
  );
}

export function OpportunityCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { create } = useOpportunityMutations();
  const fromQuickOpportunity = searchParams.get('fromQuick') === '1';

  return (
    <>
      <PageHeader title="Nova oportunidade" subtitle="Associe cliente e veículo" />
      <OpportunityForm
        fromQuickOpportunity={fromQuickOpportunity}
        defaultValues={{
          customerId: searchParams.get('customerId') ?? '',
          vehicleId: searchParams.get('vehicleId') ?? '',
          status: 'NovoLead',
          proposedValue: 0,
          notes: '',
        }}
        submitting={create.isPending}
        onSubmit={(values) => {
          create.mutate(values, { onSuccess: () => navigate('/opportunities') });
        }}
      />
    </>
  );
}

export function OpportunityEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOpportunity(id);
  const { update } = useOpportunityMutations();

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Oportunidade não encontrada.')} />;

  return (
    <>
      <PageHeader title="Editar oportunidade" subtitle={data.customerName} />
      <OpportunityForm
        defaultValues={{
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          status: data.status,
          proposedValue: data.proposedValue,
          notes: data.notes ?? '',
        }}
        submitting={update.isPending}
        onSubmit={(values) => {
          update.mutate(
            { id: data.id, payload: values },
            { onSuccess: () => navigate(`/opportunities/${data.id}`) },
          );
        }}
      />
    </>
  );
}

export function OpportunityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOpportunity(id);

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Oportunidade não encontrada.')} />;

  return (
    <>
      <PageHeader title="Detalhes da oportunidade" subtitle={data.customerName}>
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/opportunities')}>
          Voltar
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/opportunities/${data.id}/edit`)}>
          Editar
        </Button>
      </PageHeader>
      <Grid container spacing={2}>
        {[
          ['Cliente', data.customerName],
          ['E-mail', data.customerEmail],
          ['Telefone', data.customerPhone],
          ['Veículo', `${data.vehicleBrand} ${data.vehicleModel}`],
          ['Ano do veículo', String(data.vehicleYear)],
          ['Preço do veículo', formatCurrency(data.vehiclePrice)],
          ['Status', opportunityStatusLabels[data.status]],
          ['Valor proposto', formatCurrency(data.proposedValue)],
          ['Observações', data.notes || '-'],
          ['Data de Criação/Atualização', formatDate(getLastModifiedAt(data))],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body1">{value}</Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
