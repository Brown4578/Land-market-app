import TransferHistoryView from './components/TransferHistoryView';
import NewTransfer from './components/NewTransfer';

export const propertyTransferRoutes = [
  {
    key: '/transfer-history',
    exact: true,
    element: <TransferHistoryView />,
    name: 'Transfer History View',
  },
  {
    key: '/new-plot-transfer',
    exact: true,
    element: <NewTransfer />,
    name: 'New Transfer',
  },
];
