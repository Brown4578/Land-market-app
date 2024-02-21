import { routes as home } from './views/PropertySearch';
import { routes as plotsRoutes } from './views/PropertyManagement';
import { routes as systemSettings } from './views/SystemSettings';
import { phasesRoutes } from './views/Phases';
import { blocksRoutes } from './views/Blocks';
import { membersRoutes } from './views/MemberManagement';
import { propertyTransferRoutes } from './views/TransferHistory';
import { scannedDocsRoutes } from './views/ScannedDocuments';
import { accountingRoutes } from './views/Accounting';
import { marketersRoutes } from './views/MarketerManagement';
import { dashboardRoutes } from './views/Dashboard';
import { accountingReportsRoutes } from './views/Reports';

export const routes = [
  ...home,
  ...plotsRoutes,
  ...phasesRoutes,
  ...blocksRoutes,
  ...membersRoutes,
  ...propertyTransferRoutes,
  ...scannedDocsRoutes,
  ...accountingRoutes,
  ...systemSettings,
  ...marketersRoutes,
  ...dashboardRoutes,
  ...accountingReportsRoutes,
];
