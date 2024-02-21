import { Badge, Tag } from 'antd';

export const memberColumns = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 170,
    align: 'left',
  },
  {
    title: 'ID No.',
    dataIndex: 'idNumber',
    key: 'idNumber',
    width: 100,
  },
  {
    title: 'Phone No.',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 100,
    //The below code is problematic, it is prompting the user to make a call when the modal appears

    // render: (text) => (
    //   <a style={{ textDecoration: 'none' }} href={`tel:` + text}>
    //     {text}
    //   </a>
    // ),
  },
  {
    title: 'Email Address',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
    width: 150,
    render: (text) => (
      <a style={{ textDecoration: 'none' }} href={`mailto:` + text}>
        {text}
      </a>
    ),
  },
  {
    title: 'County',
    dataIndex: 'county',
    key: 'county',
    width: 100,
  },
  {
    title: 'Sub-County',
    dataIndex: 'subCounty',
    key: 'subCounty',
    width: 100,
  },
  {
    title: 'Type',
    dataIndex: 'memberType',
    key: 'memberType',
    width: 80,
    render: (text) => (
      <Tag color={text === 'INDIVIDUAL' ? '#2db7f5' : '#87d068' ?? '#f50'}>
        {text === 'INDIVIDUAL' ? 'Individual' : 'Group' ?? 'Missing'}
      </Tag>
    ),
  },
];

export const groupMemberColumns = [
  {
    title: 'Identification No.',
    dataIndex: 'groupData.identificationNumber',
    key: 'groupData.identificationNumber',
    render: (text, row) => <span>{row?.groupData?.identificationNumber}</span>,
  },
  {
    title: 'Group Name',
    dataIndex: 'groupData.groupName',
    key: 'groupData.groupName',
    render: (text, row) => <span>{row?.groupData?.groupName}</span>,
  },
  {
    title: 'Type',
    dataIndex: 'memberType',
    key: 'memberType',
    width: '11%',
    render: (text) => (
      <Tag color={text === 'INDIVIDUAL' ? '#2db7f5' : '#87d068' ?? '#f50'}>
        {text === 'INDIVIDUAL' ? 'Individual' : 'Group' ?? 'Missing'}
      </Tag>
    ),
  },
  {
    title: 'Reg. Date',
    dataIndex: 'groupData.registrationDate',
    key: 'groupData.registrationDate',
  },
  {
    title: 'No. of Members',
    dataIndex: 'badge',
    key: 'badge',
    render: (text, row) => (
      <Badge
        count={row?.groupData?.groupMembersData.length ?? 0}
        style={{ background: 'purple' }}
      />
    ),
  },

  {
    title: 'Comments',
    dataIndex: 'groupData.comments',
    key: 'groupData.comments',
    render: (text, row) => <span>{row?.groupData?.comments}</span>,
  },
];
