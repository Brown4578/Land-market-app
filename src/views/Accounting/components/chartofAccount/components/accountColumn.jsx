import { NumericFormat } from 'react-number-format';
import { Tag, Typography } from 'antd';
import {
  addSpacesToCamelCase,
  generateColor,
} from '../../../../../_helpers/utils/StringManipulator';

const { Paragraph, Text } = Typography;

export const columns = [
  {
    title: 'Date',
    dataIndex: 'formattedDate',
    key: 'formattedDate',
    width: 100,
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    width: 200,
    render: (text) => (
      <Paragraph
        ellipsis={{
          rows: 1,
          expandable: true,
          symbol: 'more',
        }}
        style={{ width: 200 }}
        title={text}
      >
        {text || '-'}
      </Paragraph>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 250,
    render: (text) => (
      <Paragraph
        ellipsis={{
          rows: 1,
          expandable: true,
          symbol: 'more',
        }}
        style={{ width: 250 }}
        title={text}
      >
        {text || '-'}
      </Paragraph>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    align: 'center',
    render: (text) => {
      const color = generateColor(text);
      console.log('Color: ', color);
      return <Tag color={color}>{text ? addSpacesToCamelCase(text) : '-'}</Tag>;
    },
  },
  {
    title: 'Trans. no.',
    dataIndex: 'transactionNo',
    key: 'transactionNo',
    width: 120,
  },

  {
    title: 'Debit',
    dataIndex: 'formattedDebit',
    key: 'formattedDebit',
    width: 100,
    align: 'right',
    render: (text) => (
      <NumericFormat
        value={text}
        style={{ color: '#2db7f5' }}
        displayType={'text'}
        thousandSeparator={true}
      />
    ),
  },
  {
    title: 'Credit',
    dataIndex: 'formattedCredit',
    key: 'formattedCredit',
    width: 100,
    align: 'right',
    render: (text) => (
      <NumericFormat
        value={text}
        style={{ color: '#f50' }}
        displayType={'text'}
        thousandSeparator={true}
      />
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    align: 'right',
    render: (text) => (
      <NumericFormat
        value={text}
        style={{ color: '#87d068' }}
        displayType={'text'}
        thousandSeparator={true}
      />
    ),
  },
];
