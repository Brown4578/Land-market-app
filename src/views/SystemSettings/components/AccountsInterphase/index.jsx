import AccountInterphaseForm from './components/AccountsInterfaceForm';
import AccountInterphaseTable from './components/AccountsInterfaceView';

export const accountInterphaseRoutes = [
  {
    key: '/system-settings/accounts-interface',
    exact: true,
    element: <AccountInterphaseTable />,
    name: 'Accounts Interphase View',
    permission: 'view_parameters',
  },
  {
    key: '/system-settings/accounts-interface/update',
    exact: true,
    element: <AccountInterphaseForm />,
    name: 'Account Interphase Form',
    permission: 'create_parameter',
  },
];
