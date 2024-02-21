import ScannedDocsView from './components/ScannedDocsViewV2';
import AddNewDoc from './components/AddNewDoc';

export const scannedDocsRoutes = [
  {
    key: '/scanned-documents',
    exact: true,
    element: <ScannedDocsView />,
    name: 'Scanned Docs View',
    permission: 'view_scanned_documents',
  },
  {
    key: '/scanned-documents-new',
    exact: true,
    element: <AddNewDoc />,
    name: 'Add New Doc',
    permission: 'create_scanned_documents',
  },
];
