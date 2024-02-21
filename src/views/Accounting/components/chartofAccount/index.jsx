import AddAccount from './components/AddAccount_V2';
import AccountTransaction from './components/AccountTransaction';
import ChartOfAccounts from './components/ChartOfAccountsV2';

export const chartOfAccountsRoutes = [
  {
    key: '/accounting/chart-of-accounts',
    exact: true,
    element: <ChartOfAccounts />,
    name: 'Chart of Accounts',
    permission: 'view_chart_of_accounts',
  },
  {
    key: '/accounting/chart-of-accounts/new',
    exact: true,
    element: <AddAccount />,
    name: 'Add Account',
    permission: 'create_account',
  },
  {
    key: '/accounting/chart-of-accounts/details',
    exact: true,
    element: <AccountTransaction />,
    name: 'Account Transactions',
    permission: 'view_chart_of_accounts',
  },
];
