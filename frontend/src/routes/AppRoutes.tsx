import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import {
  CustomerCreatePage,
  CustomerDetailsPage,
  CustomerEditPage,
  CustomerListPage,
} from '../pages/Customers/CustomerPages';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import {
  OpportunityCreatePage,
  OpportunityDetailsPage,
  OpportunityEditPage,
  OpportunityListPage,
} from '../pages/Opportunities/OpportunityPages';
import {
  VehicleCreatePage,
  VehicleDetailsPage,
  VehicleEditPage,
  VehicleListPage,
} from '../pages/Vehicles/VehiclePages';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="vehicles" element={<VehicleListPage />} />
          <Route path="vehicles/new" element={<VehicleCreatePage />} />
          <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="vehicles/:id/edit" element={<VehicleEditPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/new" element={<CustomerCreatePage />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          <Route path="customers/:id/edit" element={<CustomerEditPage />} />
          <Route path="opportunities" element={<OpportunityListPage />} />
          <Route path="opportunities/new" element={<OpportunityCreatePage />} />
          <Route path="opportunities/:id" element={<OpportunityDetailsPage />} />
          <Route path="opportunities/:id/edit" element={<OpportunityEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
