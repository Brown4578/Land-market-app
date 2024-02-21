import ReceiptView from './components/ReceiptView';
import ReceiptForm from './components/ReceiptForm';

export const receiptsRoutes = [
  {
    key: '/accounting/receipt',
    exact: true,
    element: <ReceiptView />,
    name: 'Receipt View',
    permission: 'view_receipts',
  },
  {
    key: '/accounting/receipt/new',
    exact: true,
    element: <ReceiptForm />,
    name: 'New Receipt',
    permission: 'create_receipt',
  },
  {
    key: '/accounting/receipt/edit',
    exact: true,
    element: <ReceiptForm />,
    name: 'Edit Receipt',
    permission: 'create_receipt',
  },
];
