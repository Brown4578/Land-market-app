import MemberView from './components/MemberView';
import MemberDetails from './components/MemberDetails';
import NewMember from './components/NewMember';
import MemberStatement from './components/MemberStatement';

export const membersRoutes = [
  {
    key: '/members-register',
    exact: true,
    element: <MemberView />,
    name: 'Members View',
    permission: 'view_member_register',
  },
  {
    key: '/member-details',
    exact: true,
    element: <MemberDetails />,
    name: 'Members Details',
    permission: 'create_member',
  },
  {
    key: '/new-member',
    exact: true,
    element: <NewMember />,
    name: 'New Member(s) Form',
    permission: 'create_member',
  },
  {
    key: '/member-statements',
    exact: true,
    element: <MemberStatement />,
    name: 'Member Statement',
    permission: 'view_member_statement',
  },
];
