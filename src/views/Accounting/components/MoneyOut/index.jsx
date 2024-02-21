import PaymentView from './components/PaymentView';
import PaymentForm from './components/PaymentForm';

export const paymentsRoutes = [
  {
    key: '/accounting/payment',
    exact: true,
    element: <PaymentView />,
    name: 'Payment View',
    permission: 'view_payments',
  },
  {
    key: '/accounting/payment/new',
    exact: true,
    element: <PaymentForm />,
    name: 'New Payment',
    permission: 'create_payment',
  },
  {
    key: '/accounting/payment/edit',
    exact: true,
    element: <PaymentForm />,
    name: 'Edit Payment',
    permission: 'create_payment',
  },
];
