import ReportsView from './components/ReportsView';

export const accountingReportsRoutes = [
  {
    key: '/accounting/reports',
    exact: true,
    element: <ReportsView />,
    name: 'Reports View',
    permission: 'view_reports',
  },
  {
    key: '/reports',
    exact: true,
    element: <ReportsView />,
    name: 'Reports View',
    permission: 'view_reports',
  },
];
