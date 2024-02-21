import { receiptsRoutes } from './components/MoneyIn';
import { paymentsRoutes } from './components/MoneyOut';
import { chartOfAccountsRoutes } from './components/chartofAccount';
import { journalsRoutes } from './components/journal';

export const accountingRoutes = [
  ...receiptsRoutes,
  ...paymentsRoutes,
  ...chartOfAccountsRoutes,
  ...journalsRoutes,
];
