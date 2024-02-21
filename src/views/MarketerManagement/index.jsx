import MarketerForm from './components/marketerForm';
import Marketers from './components/marketers';
import CommissionView from './components/CommissionView';
import FtLeadForm from './components/Ftleadform';
import { FaCartFlatbedSuitcase } from 'react-icons/fa6';
import Ftleads from './components/Ftleads';

export const marketersRoutes = [
  {
    key: '/marketers-register',
    exact: true,
    element: <Marketers />,
    name: 'Marketers View',
    permission: 'view_marketer_register',
  },
  {
    key: '/marketers-commission',
    exact: true,
    element: <CommissionView />,
    name: 'Commission View',
    permission: 'view_commissions',
  },
  {
    key: '/marketers/new',
    exact: true,
    element: <MarketerForm />,
    name: 'Marketer Form',
    permission: 'create_marketer',
  },
  {
    key: '/marketers/update',
    exact: true,
    element: <MarketerForm />,
    name: 'Marketer Form',
    permission: 'create_marketer',
  },
  {
    key: '/marketers/leads',
    exact: true,
    element: <FtLeadForm />,
    name: 'Lead Form',
    permission: 'create_marketer',
  },
  {
    key: '/marketers/listLeads',
    exact: true,
    element: <Ftleads />,
    name: 'leads list',
    permission: 'create_marketer',
  },

];
