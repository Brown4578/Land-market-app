import PlotsView from './plots/PlotsView';
import NewPlot from './plots/NewPlot';
import ScannedDocsView from './plots/ScannedFilesView';
import SaleAgreement from './plots/SaleAgreements';
import NewSaleAgreement from './plots/SaleAgreementForm';
import MemberStatementBySalesAgreement from './plots/MemberStatementBySalesAgreement';

export const plotsRoutes = [
  {
    key: '/plot-register',
    exact: true,
    element: <PlotsView />,
    name: 'Plots View',
    permission: 'view_plot_register',
  },
  {
    key: '/new-plot',
    exact: true,
    element: <NewPlot />,
    name: 'New Plot',
    permission: 'create_plot',
  },
  {
    key: '/edit-plot',
    exact: true,
    element: <NewPlot />,
    name: 'Update Plot',
    permission: 'create_plot',
  },
  {
    key: '/plot-files',
    exact: true,
    element: <ScannedDocsView />,
    name: 'Scanned Docs View',
    permission: 'view_scanned_documents',
  },
  {
    key: '/sale-agreements',
    exact: true,
    element: <SaleAgreement />,
    name: 'Sale Agreements',
    permission: 'view_sales_agreements',
  },
  {
    key: '/sale-agreements/new',
    exact: true,
    element: <NewSaleAgreement />,
    name: 'Sale agreements',
    permission: 'create_sales_agreement',
  },
  {
    key: '/sale-agreements/update',
    exact: true,
    element: <NewSaleAgreement />,
    name: 'Sale agreements',
    permission: 'create_sales_agreement',
  },
  {
    key: '/sale-agreements/member-statement',
    exact: true,
    element: <MemberStatementBySalesAgreement />,
    name: 'Member Statement By Sales Agreement',
  },
];
