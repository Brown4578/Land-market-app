import { Card, Tag } from 'antd';

export const transferColumns = [
  {
    title: 'Title No.',
    dataIndex: 'titleNo',
    key: 'titleNo',
  },
  {
    title: 'Document No.',
    dataIndex: 'documentNumber',
    key: 'documentNumber',
  },
  {
    title: 'Transfer Date',
    dataIndex: 'transferDate',
    key: 'transferDate',
    align: 'center',
  },
  {
    title: 'Transfer From',
    dataIndex: 'transferFrom',
    key: 'transferFrom',
    render: (text) => (
      <Tag color='#f50'>
        {text?.memberFirstName +
          ' ' +
          text.memberSurname +
          ' ' +
          text.memberSecondName}
      </Tag>
    ),
  },
  {
    title: 'Transfer To',
    dataIndex: 'transferTo',
    key: 'transferTo',
    render: (text) => (
      <Tag color='#87d068'>
        {text?.memberFirstName +
          ' ' +
          text.memberSurname +
          ' ' +
          text.memberSecondName}
      </Tag>
    ),
  },
];
