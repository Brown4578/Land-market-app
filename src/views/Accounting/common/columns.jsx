import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { NumericFormat } from 'react-number-format';
import { Tag } from 'antd';
import { convertToLowerThenCapitalize } from '../../../_helpers/utils/StringManipulator';
import { generateColor } from '../../../_helpers/utils/StringManipulator';

const dateFormat = 'YYYY-MM-DD hh:mm a';

export const statementColumns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: 75,
    align: 'left',
    render: (text, row, index) => (
      <span className='d-flex justify-content-start'>
        <NumericFormat
          value={index + 1}
          suffix='.'
          displayType={'text'}
          thousandSeparator={true}
        />
      </span>
    ),
  },

  {
    title: 'Trans No.',
    dataIndex: 'transactionNumber',
    key: 'transactionNumber',
    width: 150,
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    width: 160,
    render: (text, row) => <>{text ? dayjs(text).format(dateFormat) : '-'}</>,
  },
  {
    title: 'Mode of Payment',
    dataIndex: 'paymentMode',
    key: 'paymentMode',
    width: 135,
    align: 'center',
    render: (text, row) => (
      <>{text ? <Tag color={generateColor(text)}>{text}</Tag> : '-'}</>
    ),
  },
  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   key: 'amount',
  //   width: 130,
  //   align: 'right',
  //   render: (text, row) => (
  //     <>
  //       {text ? (
  //         <NumericFormat
  //           value={text || row?.debit || row?.credit}
  //           style={{ color: '#87d068' }}
  //           displayType={'text'}
  //           thousandSeparator={true}
  //         />
  //       ) : (
  //         '-'
  //       )}
  //     </>
  //   ),
  // },
  {
    title: 'Debit',
    dataIndex: 'debit',
    key: 'debit',
    width: 100,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            style={{ color: '#87d068' }}
            displayType={'text'}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Credit',
    dataIndex: 'credit',
    key: 'credit',
    width: 100,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            style={{ color: '#2db7f5' }}
            displayType={'text'}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
    width: 130,
    align: 'center',
    render: (text, row) => (
      <Tag color={generateColor(text)}>
        {text && text === 'LoanCredit'
          ? 'Loan Credit'
          : text === 'MemberReceipt'
          ? 'Member Receipt'
          : text}
      </Tag>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'remarks',
    key: 'remarks',
  },
];
export const memberStatementColumns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: 75,
    align: 'left',
    render: (text, row, index) => (
      <span className='d-flex justify-content-start'>
        <NumericFormat
          value={index + 1}
          suffix='.'
          displayType={'text'}
          thousandSeparator={true}
        />
      </span>
    ),
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    width: 160,
    render: (text, row) => <>{text ? dayjs(text).format(dateFormat) : '-'}</>,
  },
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
    width: 130,
    align: 'center',
    render: (text, row) => (
      <Tag color={generateColor(text)}>
        {text && text === 'LoanCredit'
          ? 'Loan Credit'
          : text === 'MemberReceipt'
          ? 'Member Receipt'
          : text}
      </Tag>
    ),
  },
  {
    title: 'Document No.',
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 150,
  },
  {
    title: 'Description',
    dataIndex: 'remarks',
    key: 'remarks',
    width: 150,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            style={{ color: '#87d068' }}
            displayType={'text'}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            style={{ color: '#87d068' }}
            displayType={'text'}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Mode of Payment',
    dataIndex: 'paymentMode',
    key: 'paymentMode',
    width: 135,
    align: 'center',
    render: (text, row) => (
      <>{text ? <Tag color={generateColor(text)}>{text}</Tag> : '-'}</>
    ),
  },
  {
    title: 'Running Balance',
    dataIndex: 'runningBalance',
    key: 'runningBalance',
    width: 100,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            style={{ color: '#87d068' }}
            displayType={'text'}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
];
