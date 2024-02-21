import DashboardView from './components/Dashboard';

export const dashboardRoutes = [
  {
    key: '/',
    exact: true,
    element: <DashboardView />,
    name: 'Dashboard View',
    permission: 'view_dashboard',
  },
];
