import { NumericFormat } from 'react-number-format';

export const phaseColumns = [
  {
    title: 'Phase Name',
    dataIndex: 'phaseName',
    key: 'phaseName',
    fixed: 'left',
    width: 150,
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },

  {
    title: 'Block Name',
    dataIndex: 'blockName',
    key: 'blockName',
    fixed: 'left',
    width: 150,
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },

  {
    title: 'Purchase Price',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.totalPurchasePrice ? (
            <NumericFormat
              value={salesSummary?.totalPurchasePrice}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Total Expenses',
    dataIndex: 'totalExpenses',
    key: 'totalExpenses',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.totalExpenses ? (
            <NumericFormat
              value={salesSummary?.totalExpenses}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Total Revenue',
    dataIndex: 'totalRevenue',
    key: 'totalRevenue',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.totalRevenue ? (
            <NumericFormat
              value={salesSummary?.totalRevenue}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Gross Profit',
    dataIndex: 'grossProfit',
    key: 'grossProfit',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.grossProfit ? (
            <NumericFormat
              value={salesSummary?.grossProfit}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Total Receipts',
    dataIndex: 'totalReceipts',
    key: 'totalReceipts',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.totalReceipts ? (
            <NumericFormat
              value={salesSummary?.totalReceipts}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Total Credit',
    dataIndex: 'totalCredit',
    key: 'totalCredit',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.totalCredit ? (
            <NumericFormat
              value={salesSummary?.totalCredit}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },

  {
    title: 'Cash Sales',
    dataIndex: 'cashSales',
    key: 'cashSales',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.cashSales ? (
            <NumericFormat
              value={salesSummary?.cashSales}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    title: 'Hp Sales',
    dataIndex: 'hpSales',
    key: 'hpSales',
    width: 115,
    align: 'center',
    render: (text, row) => {
      const { salesSummary } = row;
      return (
        <>
          {salesSummary?.hpSales ? (
            <NumericFormat
              value={salesSummary?.hpSales}
              displayType={'text'}
              thousandSeparator={true}
              // style={{ color: '#108ee9' }}
            />
          ) : (
            '-'
          )}
        </>
      );
    },
  },

  {
    title: 'Sale Completion Target Date',
    dataIndex: 'saleCompletionTargetDate',
    key: 'saleCompletionTargetDate',
    width: 200,
    align: 'center',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    width: 150,
    align: 'center',
  },
  {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
    width: 150,
  },
];

const convertToLowerThenCapitalize = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word[0]?.toUpperCase() + word.slice(1);
    })
    .join(' ');
};
