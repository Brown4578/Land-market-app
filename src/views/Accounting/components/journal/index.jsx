import CreateJournal from './components/CreateJournalV2';
import Journals from './components/Journals';
import JournalInfo from './components/JournalInfo';

export const journalsRoutes = [
  {
    key: '/accounting/journals/new',
    exact: true,
    element: <CreateJournal />,
    name: 'Create Journal',
    permission: 'create_journal',
  },

  {
    key: '/accounting/journals',
    exact: true,
    element: <Journals />,
    name: 'Journals',
    permission: 'view_journal_entries',
  },

  {
    key: '/accounting/journals/view/details',
    exact: true,
    element: <JournalInfo />,
    name: 'Journal Info',
    permission: 'view_journal_entries',
  },
];
