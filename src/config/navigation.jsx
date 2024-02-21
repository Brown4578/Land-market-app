import { GiKenya } from 'react-icons/gi';
import { AiOutlineBlock, AiOutlineSetting } from 'react-icons/ai';
import { BsListStars, BsJournals } from 'react-icons/bs';
import { RiFolderTransferLine, RiUserStarLine } from 'react-icons/ri';
import { FaUsersBetweenLines, FaUsersGear } from 'react-icons/fa6';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import {
  MdOutlineScatterPlot,
  MdDocumentScanner,
  MdAccountBalanceWallet,
  MdOutlineAdminPanelSettings,
  MdOutlineAccountTree,
} from 'react-icons/md';
import { TbLicense } from 'react-icons/tb';
import { LuSearch } from 'react-icons/lu';
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { VscGear } from 'react-icons/vsc';
import { GrPieChart } from 'react-icons/gr';
import { TbReportSearch } from 'react-icons/tb';

export const NavigationItems = [
  {
    label: 'Dashboard',
    icon: <GrPieChart />,
    key: '/',
    url: '/',
    permission: 'view_dashboard',
  },
  {
    label: 'Property Search',
    icon: <LuSearch />,
    key: '/property-search',
    url: '/property-search',
    permission: 'view_property_search',
  },

  {
    label: 'Property Management',
    icon: <GiKenya />,
    key: 'property-management',
    url: 'property-management',
    permission: 'view_property_management_module',
    children: [
      {
        label: 'Blocks',
        icon: <AiOutlineBlock />,
        key: '/blocks',
        url: '/blocks',
        permission: 'view_blocks',
      },
      {
        label: 'Phases',
        icon: <BsListStars />,
        key: '/phases',
        url: '/phases',
        permission: 'view_phases',
      },

      {
        label: 'Plots Management',
        key: 'plot-management',
        type: 'group',
        permission: 'view_property_management_module',
        children: [
          {
            label: 'Plots Register',
            icon: <MdOutlineScatterPlot />,
            key: '/plot-register',
            url: '/plot-register',
            permission: 'view_plot_register',
          },

          {
            label: 'Sale Agreement',
            icon: <TbLicense />,
            key: '/sale-agreements',
            url: '/sale-agreements',
            permission: 'view_sales_agreements',
          },
          {
            label: 'Transfer History',
            icon: <RiFolderTransferLine />,
            key: '/transfer-history',
            url: '/transfer-history',
            permission: 'view_plot_transfers',
          },
        ],
      },
      {
        label: 'Documents',
        key: 'documents',
        type: 'group',
        permission: 'view_scanned_documents',
        children: [
          {
            label: 'Scanned Docs',
            icon: <MdDocumentScanner />,
            key: '/scanned-documents',
            url: '/scanned-documents',
            permission: 'view_scanned_documents',
          },
        ],
      },
    ],
  },
  {
    label: 'Members Management',
    icon: <FaUsers />,
    key: 'member-management',
    url: 'member-management',
    permission: 'view_member_management_module',
    children: [
      {
        label: "Members' Register",
        icon: <FaUsers />,
        key: '/members-register',
        url: '/members-register',
        permission: 'view_member_register',
      },
      {
        label: 'Member Statement',
        icon: <IoDocumentTextOutline />,
        key: '/member-statements',
        url: '/member-statements',
        permission: 'view_member_statement',
      },
    ],
  },

  {
    label: 'Marketers Management',
    icon: <RiUserStarLine />,
    key: 'marketers-management',
    url: 'marketers-management',
    permission: 'view_marketer_management_module',
    children: [
      {
        label: 'Register',
        icon: <FaUsersBetweenLines />,
        key: '/marketers-register',
        url: '/marketers-register',
        permission: 'view_marketer_register',
      },
      {
        label: 'Commissions',
        icon: <FaUsersBetweenLines />,
        key: '/marketers-commission',
        url: '/marketers-commission',
        permission: 'view_commissions',
      },
      {
        label: 'Leads',
        icon: <FaUsersBetweenLines />,
        key: '/marketers/listLeads',
        url: '/marketers/listLeads',
        permission: 'view_commissions',
      },
    ],
  },
  {
    label: 'Accounting',
    icon: <MdAccountBalanceWallet />,
    key: 'accounting',
    url: 'accounting',
    permission: 'view_accounting_module',
    children: [
      {
        label: 'Receipts',
        icon: <GiReceiveMoney />,
        key: '/accounting/receipt',
        url: '/accounting/receipt',
        permission: 'view_receipts',
      },
      {
        label: 'Payments',
        icon: <GiPayMoney />,
        key: '/accounting/payment',
        url: '/accounting/payment',
        permission: 'view_payments',
      },
      {
        label: 'Chart of Accounts',
        icon: <MdOutlineAccountTree />,
        url: '/accounting/chart-of-accounts',
        key: '/accounting/chart-of-accounts',
        permission: 'view_chart_of_accounts',
      },
      {
        label: 'Journal Entry',
        icon: <BsJournals />,
        key: '/accounting/journals',
        url: '/accounting/journals',
        permission: 'view_journal_entries',
      },
      {
        label: 'Reports',
        icon: <TbReportSearch />,
        key: '/accounting/reports',
        url: '/accounting/reports',
        permission: 'view_reports',
      },

      {
        label: 'Settings',
        icon: <AiOutlineSetting />,
        key: '/accounting/settings',
        url: '/accounting/settings',
        permission: 'view_accounting_settings',
      },
    ],
  },

  {
    label: 'Administration',
    icon: <MdOutlineAdminPanelSettings />,
    key: 'administration',
    url: 'administration',
    permission: 'view_administration_module',
    children: [
      {
        label: 'System Settings',
        icon: <VscGear />,
        key: '/system-settings',
        url: '/system-settings',
        permission: 'view_system_settings',
      },
      {
        label: 'Users & Roles',
        icon: <FaUsersGear />,
        key: '/user-management',
        url: '/user-management',
        permission: 'view_users_and_roles',
      },
      {
        label: 'Reports',
        icon: <TbReportSearch />,
        key: '/reports',
        url: '/reports',
        permission: 'view_reports',
      },
    ],
  },
];
