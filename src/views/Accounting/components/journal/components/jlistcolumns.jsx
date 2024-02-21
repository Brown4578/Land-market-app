import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Tooltip, Typography } from 'antd';

const { Paragraph } = Typography;

export const journalColumns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: '8%',
    defaultSortOrder: 'descend',
    sortDirections: ['descend'],
    sorter: (a, b) => a.id - b.id,
    render: (text, row) => <span>{text}</span>,
  },
  {
    title: 'Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    width: '13%',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.transactionDate - b.transactionDate,
    // render: (text) => (
    //   <>
    //     <Tooltip title={text}>
    //       <span>{text && moment(text).format('MMMM Do YYYY')}</span>
    //     </Tooltip>
    //   </>
    // ),
  },

  {
    title: 'Type',
    dataIndex: 'transactionType',
    key: 'transactionType',
    width: '15%',
    render: (text) => (
      <>
        <span>{text && text.split('_').join(' ')}</span>
      </>
    ),
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: '10%',
    render: (text) => (
      <>
        <NumericFormat
          value={text}
          displayType={'text'}
          thousandSeparator={true}
        />
      </>
    ),
  },
];

export const journalInfoColumns = [
  {
    title: '#',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
    width: '15%',
  },
  {
    title: 'Acc. Name',
    dataIndex: 'accountName',
    key: 'accountName',
    width: '20%',
    render: (text) => <span>{text}</span>,
  },

  {
    title: 'Debit',
    dataIndex: 'formattedDebit',
    key: 'formattedDebit',
    width: '15%',
    align: 'right',
  },
  {
    title: 'Credit',
    dataIndex: 'formattedCredit',
    key: 'formattedCredit',
    width: '15%',
    align: 'right',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '25%',
    align: 'left',
    render: (text) => (
      <>
        <Paragraph ellipsis={{ rows: 2, expandable: true }}>{text}</Paragraph>
      </>
    ),
  },
];
