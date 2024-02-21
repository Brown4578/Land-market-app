import EditUser from './components/userForm';
import AddRole from '../RolesandPermissions/AddRole';
import AssignPermission from '../RolesandPermissions/AssignPermissionV2';

export const userRoutes = [
  {
    key: '/user-management/user/edit-user',
    exact: true,
    name: 'Edit User',
    element: <EditUser />,
    permission: 'create_user',
  },
  {
    key: '/user-management/roles/add',
    exact: true,
    name: 'Add Role',
    element: <AddRole />,
    permission: 'create_role',
  },
  {
    key: '/user-management/roles/edit',
    exact: true,
    name: 'Edit Role',
    element: <AddRole />,
    permission: 'create_role',
  },
  {
    key: '/user-management/assign-permissions',
    exact: true,
    name: 'Assign Permission',
    element: <AssignPermission />,
    permission: 'permission_assignment',
  },
];
