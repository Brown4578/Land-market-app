import CodeForm from './components/CodeForm';
import CodesTable from './components/CodesView';

export const codeValueRoutes = [
  {
    key: '/system-settings/parameters',
    exact: true,
    element: <CodesTable />,
    name: 'Parameters View',
    permission: 'view_parameters',
  },
  {
    key: '/system-settings/new-parameter',
    exact: true,
    element: <CodeForm />,
    name: 'New Parameter',
    permission: 'create_parameter',
  },
  {
    key: '/system-settings/update-parameter',
    exact: true,
    element: <CodeForm />,
    name: 'Update Code',
    permission: 'create_parameter',
  },
];
