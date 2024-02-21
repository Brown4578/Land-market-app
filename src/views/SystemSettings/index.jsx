import Settings from './Settings';
import { codeValueRoutes } from './components/Codes';
import { companySettingsRoutes } from './components/Company';
import { userRoutes } from './userManagement/Users';
import UserManagement from './userManagement';
import { accountInterphaseRoutes } from './components/AccountsInterphase';

export const routes = [
  ...codeValueRoutes,
  ...userRoutes,
  ...companySettingsRoutes,
  ...accountInterphaseRoutes,
  {
    key: '/system-settings',
    exact: true,
    element: <Settings />,
    name: 'System Settings View',
    permission: 'view_system_settings',
  },
  {
    key: '/user-management',
    exact: true,
    name: 'User & Roles',
    element: <UserManagement />,
    permission: 'view_users_and_roles',
  },
];
