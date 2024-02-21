import BlockView from './components/BlocksView';
import NewBlock from './components/NewBlock';

export const blocksRoutes = [
  {
    key: '/blocks',
    exact: true,
    element: <BlockView />,
    name: 'Block View',
    permission: 'view_blocks',
  },
  {
    key: '/new-block',
    exact: true,
    element: <NewBlock />,
    name: 'New Block',
    permission: 'create_block',
  },
  {
    key: '/edit-block',
    exact: true,
    element: <NewBlock />,
    name: 'Edit Block',
    permission: 'create_block',
  },
];
