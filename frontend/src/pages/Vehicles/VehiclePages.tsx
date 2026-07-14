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
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PageHeader, ErrorMessage, Loading } from '../../components/common/PageStates';
import { SearchBar } from '../../components/common/SearchBar';
import { VehicleStatusChip } from '../../components/common/StatusChip';
import { CurrencyField } from '../../components/forms/CurrencyField';
import { FormContainer } from '../../components/forms/FormContainer';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useVehicle, useVehicleMutations, useVehicles } from '../../hooks/useCrmQueries';
import type { Vehicle, VehicleFormData, VehicleStatus, VehicleType } from '../../types';
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  vehicleStatusLabels,
  vehicleTypeLabels,
} from '../../utils/format';
import { cycleSortState, getLastModifiedAt } from '../../utils/sort';

const vehicleSchema = z.object({
  brand: z.string().min(1, 'Marca obrigatória'),
  model: z.string().min(1, 'Modelo obrigatório'),
  year: z.number().min(1950).max(new Date().getFullYear() + 1),
  price: z.number().positive('Preço deve ser maior que zero'),
  color: z.string().min(1, 'Cor obrigatória'),
  mileage: z.number().min(0),
  type: z.enum(['SUV', 'Hatch', 'Sedan', 'Utilitario']),
  status: z.enum(['Disponivel', 'Reservado', 'Vendido']),
});

export function VehicleListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('lastModifiedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useVehicles({
    page,
    pageSize,
    search,
    status,
    type,
    sortBy,
    sortDirection,
  });
  const { remove } = useVehicleMutations();

  const columns: Column<Vehicle>[] = useMemo(
    () => [
      { id: 'brand', label: 'Marca', sortable: true, render: (row) => row.brand },
      { id: 'model', label: 'Modelo', sortable: true, render: (row) => row.model },
      { id: 'year', label: 'Ano', sortable: true, render: (row) => row.year },
      { id: 'type', label: 'Tipo', sortable: true, render: (row) => vehicleTypeLabels[row.type] },
      { id: 'price', label: 'Preço', sortable: true, render: (row) => formatCurrency(row.price) },
      { id: 'status', label: 'Status', sortable: true, render: (row) => <VehicleStatusChip status={row.status} /> },
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
            <IconButton size="small" onClick={() => navigate(`/vehicles/${row.id}`)}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => navigate(`/vehicles/${row.id}/edit`)}>
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
        title="Veículos"
        subtitle="Consulte, filtre e gerencie o estoque"
        actionLabel="Novo veículo"
        onAction={() => navigate('/vehicles/new')}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Buscar por marca, modelo ou cor" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Status"
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(vehicleStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            size="small"
            fullWidth
            label="Tipo"
            value={type}
            onChange={(event) => { setType(event.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(vehicleTypeLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
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
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        onSortChange={(column) => {
          const next = cycleSortState({ sortBy, sortDirection }, column);
          setSortBy(next.sortBy);
          setSortDirection(next.sortDirection);
        }}
        getRowId={(row) => row.id}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Excluir veículo"
        description="Tem certeza que deseja excluir este veículo? Se houver oportunidades vinculadas, a exclusão será bloqueada."
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

function VehicleForm({ defaultValues, onSubmit, submitting }: {
  defaultValues: VehicleFormData;
  onSubmit: (values: VehicleFormData) => void;
  submitting: boolean;
}) {
  const navigate = useNavigate();
  const { control, handleSubmit, register, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  return (
    <FormContainer
      onSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <Button onClick={() => navigate('/vehicles')}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Salvar
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Marca" fullWidth {...register('brand')} error={Boolean(errors.brand)} helperText={errors.brand?.message} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Modelo" fullWidth {...register('model')} error={Boolean(errors.model)} helperText={errors.model?.message} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <TextField
                label="Ano"
                type="number"
                fullWidth
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(Number(event.target.value))}
                error={Boolean(errors.year)}
                helperText={errors.year?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CurrencyField name="price" control={control} label="Preço" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="mileage"
            control={control}
            render={({ field }) => (
              <TextField
                label="Quilometragem"
                type="number"
                fullWidth
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(Number(event.target.value))}
                error={Boolean(errors.mileage)}
                helperText={errors.mileage?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField label="Cor" fullWidth {...register('color')} error={Boolean(errors.color)} helperText={errors.color?.message} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField select label="Tipo" fullWidth {...field} error={Boolean(errors.type)} helperText={errors.type?.message}>
                {(Object.keys(vehicleTypeLabels) as VehicleType[]).map((value) => (
                  <MenuItem key={value} value={value}>{vehicleTypeLabels[value]}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField select label="Status" fullWidth {...field} error={Boolean(errors.status)} helperText={errors.status?.message}>
                {(Object.keys(vehicleStatusLabels) as VehicleStatus[]).map((value) => (
                  <MenuItem key={value} value={value}>{vehicleStatusLabels[value]}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </FormContainer>
  );
}

export function VehicleCreatePage() {
  const navigate = useNavigate();
  const { create } = useVehicleMutations();

  return (
    <>
      <PageHeader title="Novo veículo" subtitle="Cadastre um veículo no estoque" />
      <VehicleForm
        defaultValues={{
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          price: 0,
          color: '',
          mileage: 0,
          type: 'Hatch',
          status: 'Disponivel',
        }}
        submitting={create.isPending}
        onSubmit={(values) => {
          create.mutate(values, { onSuccess: () => navigate('/vehicles') });
        }}
      />
    </>
  );
}

export function VehicleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useVehicle(id);
  const { update } = useVehicleMutations();

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Veículo não encontrado.')} />;

  return (
    <>
      <PageHeader title="Editar veículo" subtitle={`${data.brand} ${data.model}`} />
      <VehicleForm
        defaultValues={{
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          color: data.color,
          mileage: data.mileage,
          type: data.type,
          status: data.status,
        }}
        submitting={update.isPending}
        onSubmit={(values) => {
          update.mutate({ id: data.id, payload: values }, { onSuccess: () => navigate(`/vehicles/${data.id}`) });
        }}
      />
    </>
  );
}

export function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useVehicle(id);

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error, 'Veículo não encontrado.')} />;

  return (
    <>
      <PageHeader title={`${data.brand} ${data.model}`} subtitle="Detalhes do veículo">
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/vehicles')}>
          Voltar
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/vehicles/${data.id}/edit`)}>Editar</Button>
      </PageHeader>
      <Grid container spacing={2}>
        {[
          ['Marca', data.brand],
          ['Modelo', data.model],
          ['Ano', String(data.year)],
          ['Tipo', vehicleTypeLabels[data.type]],
          ['Preço', formatCurrency(data.price)],
          ['Cor', data.color],
          ['Quilometragem', `${data.mileage.toLocaleString('pt-BR')} km`],
          ['Status', vehicleStatusLabels[data.status]],
          ['Oportunidades', String(data.opportunitiesCount)],
          ['Data de Criação/Atualização', formatDate(getLastModifiedAt(data))],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body1">{value}</Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
