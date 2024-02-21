import CompanyView from './components/CompanyView';

export const companySettingsRoutes = [
  {
    key: '/system-settings/company',
    exact: true,
    element: <CompanyView />,
    name: 'Company View',
    permission: 'view_company_details',
  },
];
