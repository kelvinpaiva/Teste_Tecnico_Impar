import { zodResolver } from '@hookform/resolvers/zod';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ErrorMessage, Loading, PageHeader } from '../../components/common/PageStates';
import { SearchBar } from '../../components/common/SearchBar';
import { InterestChip, OpportunityStatusChip } from '../../components/common/StatusChip';
import { FormContainer } from '../../components/forms/FormContainer';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useCustomer, useCustomerMutations, useCustomers } from '../../hooks/useCrmQueries';
import type { Customer, CustomerFormData, CustomerInterest } from '../../types';
import {
  customerInterestLabels,
  formatCurrency,
  formatDate,
  getErrorMessage,
  opportunityStatusLabels,
} from '../../utils/format';
import { cycleSortState, getLastModifiedAt } from '../../utils/sort';

const customerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone obrigatório'),
  primaryInterest: z.enum(['SUV', 'Hatch', 'Sedan', 'Utilitario', 'CarroUsado', 'CarroZero']),
});

export function CustomerListPage() {
  const navigate = useNavigate();
  const { showInfo, showSuccess } = useSnackbar();
  const [search, setSearch] = useState('');
  const [interest, setInterest] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('lastModifiedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useCustomers({
    page,
    pageSize,
    search,
    interest,
    sortBy,
    sortDirection,
  });
  const { remove } = useCustomerMutations();

  const columns: Column<Customer>[] = useMemo(
    () => [
      { id: 'name', label: 'Nome', sortable: true, render: (row) => row.name },
      { id: 'email', label: 'E-mail', sortable: true, render: (row) => row.email },
      { id: 'phone', label: 'Telefone', render: (row) => row.phone },
      {
        id: 'interest',
        label: 'Interesse',
        sortable: true,
        render: (row) => <InterestChip interest={row.primaryInterest} />,
      },
      {
        id: 'lastModifiedAt',
        label: 'Criação/Atualização',
        sortable: true,
        render: (row) => formatDate(getLastModifiedAt(row)),
      },
      {
        id: 'quickOpportunity',
        label: 'Oportunidade Rápida',
        render: (row) => (
          <Tooltip
            title={
              row.hasQuickOpportunity
                ? 'Há veículo disponível compatível com o interesse'
                : 'Sem Oportunidade Rápida no momento'
            }
          >
            <IconButton
              size="small"
              aria-label="Oportunidade rápida"
              onClick={() => {
                if (!row.hasQuickOpportunity || !row.quickOpportunityVehicleId) {
                  showInfo('Sem Oportunidade Rápida no momento');
                  return;
                }

                showSuccess('Veículo compatível encontrado. Abrindo cadastro de oportunidade.');
                navigate(
                  `/opportunities/new?customerId=${row.id}&vehicleId=${row.quickOpportunityVehicleId}`,
                );
              }}
              sx={{
                width: 28,
                height: 28,
                border: 2,
                borderColor: row.hasQuickOpportunity ? 'success.main' : 'grey.400',
                bgcolor: row.hasQuickOpportunity ? 'success.main' : 'common.white',
                '&:hover': {
                  bgcolor: row.hasQuickOpportunity ? 'success.dark' : 'grey.100',
                },
              }}
            />
          </Tooltip>
        ),
      },
      {
        id: 'actions',
        label: 'Ações',
        render: (row) => (
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => navigate(`/customers/${row.id}`)}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/customers/${row.id}/edit`)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [navigate, showInfo, showSuccess],
  );

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle="Cadastro e consulta de clientes"
        actionLabel="Novo cliente"
        onAction={() => navigate('/customers/new')}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Buscar por nome, e-mail ou telefone"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Interesse"
            value={interest}
            onChange={(event) => {
              setInterest(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(customerInterestLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
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
        title="Excluir cliente"
        description="Tem certeza que deseja excluir este cliente? Se houver oportunidades vinculadas, a exclusão será bloqueada."
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

function CustomerForm({
  defaultValues,
  onSubmit,
  submitting,
}: {
  defaultValues: CustomerFormData;
  onSubmit: (values: CustomerFormData) => void;
  submitting: boolean;
}) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <FormContainer
      onSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <Button onClick={() => navigate('/customers')}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Salvar
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nome"
            fullWidth
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="E-mail"
            fullWidth
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Telefone"
            fullWidth
            {...register('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="primaryInterest"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Interesse principal"
                fullWidth
                {...field}
                error={Boolean(errors.primaryInterest)}
                helperText={errors.primaryInterest?.message}
              >
                {(Object.keys(customerInterestLabels) as CustomerInterest[]).map((value) => (
                  <MenuItem key={value} value={value}>
                    {customerInterestLabels[value]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </FormContainer>
  );
}

export function CustomerCreatePage() {
  const navigate = useNavigate();
  const { create } = useCustomerMutations();

  return (
    <>
      <PageHeader title="Novo cliente" subtitle="Cadastre um novo cliente" />
      <CustomerForm
        defaultValues={{
          name: '',
          email: '',
          phone: '',
          primaryInterest: 'SUV',
        }}
        submitting={create.isPending}
        onSubmit={(values) => {
          create.mutate(values, { onSuccess: () => navigate('/customers') });
        }}
      />
    </>
  );
}

export function CustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useCustomer(id);
  const { update } = useCustomerMutations();

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Cliente não encontrado.')} />;

  return (
    <>
      <PageHeader title="Editar cliente" subtitle={data.name} />
      <CustomerForm
        defaultValues={{
          name: data.name,
          email: data.email,
          phone: data.phone,
          primaryInterest: data.primaryInterest,
        }}
        submitting={update.isPending}
        onSubmit={(values) => {
          update.mutate(
            { id: data.id, payload: values },
            { onSuccess: () => navigate(`/customers/${data.id}`) },
          );
        }}
      />
    </>
  );
}

export function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useCustomer(id);

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Cliente não encontrado.')} />;

  return (
    <>
      <PageHeader title={data.name} subtitle="Detalhes do cliente">
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/customers')}>
          Voltar
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/customers/${data.id}/edit`)}>
          Editar
        </Button>
      </PageHeader>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          ['E-mail', data.email],
          ['Telefone', data.phone],
          ['Interesse', customerInterestLabels[data.primaryInterest]],
          ['Data de Criação/Atualização', formatDate(getLastModifiedAt(data))],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body1">{value}</Typography>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Oportunidades
      </Typography>
      {data.opportunities.length === 0 ? (
        <Typography color="text.secondary">Nenhuma oportunidade vinculada.</Typography>
      ) : (
        <Stack spacing={1}>
          {data.opportunities.map((item) => (
            <Stack
              key={item.id}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                component={RouterLink}
                to={`/opportunities/${item.id}`}
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                {item.vehicleBrand} {item.vehicleModel}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <OpportunityStatusChip status={item.status} />
                <Typography>{formatCurrency(item.proposedValue)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {opportunityStatusLabels[item.status]}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
}
