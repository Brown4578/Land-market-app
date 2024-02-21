import { Tag } from 'antd';

export const UsersColumns = [
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName',
    width: 150,
  },
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 250,
  },

  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250,
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    key: 'roles',
    render: (text, record) =>
      text &&
      text.split(',').map((item, row, index) => (
        <Tag key={index} color={'#2db7f5'}>
          {item.replace(/_/g, ' ')}
        </Tag>
      )),
  },
];
