import { Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ErrorMessage, Loading, PageHeader } from '../../components/common/PageStates';
import { useDashboard } from '../../hooks/useCrmQueries';
import {
  getErrorMessage,
  opportunityStatusLabels,
  vehicleStatusLabels,
} from '../../utils/format';

const chartColors = ['#0B3D60', '#1F6AA5', '#E8A838', '#2E7D32', '#D32F2F', '#5A6A7A'];

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <Loading />;
  if (isError || !data) return <ErrorMessage message={getErrorMessage(error)} />;

  const vehicleChartData = data.vehiclesByStatus.map((item) => ({
    name: vehicleStatusLabels[item.status] ?? item.status,
    value: item.count,
  }));

  const opportunityChartData = data.opportunitiesByStatus.map((item) => ({
    name: opportunityStatusLabels[item.status] ?? item.status,
    value: item.count,
  }));

  const cards = [
    { label: 'Total de veículos', value: data.totalVehicles },
    { label: 'Total de clientes', value: data.totalCustomers },
    { label: 'Total de oportunidades', value: data.totalOpportunities },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral do CRM" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h4" color="primary">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Veículos por status
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={vehicleChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {vehicleChartData.map((_, index) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Oportunidades por status
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={opportunityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0B3D60" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Stack sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Os indicadores refletem os dados pré-cadastrados e as alterações realizadas no CRM.
        </Typography>
      </Stack>
    </>
  );
}
