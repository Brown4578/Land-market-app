import { Tag } from 'antd';
import { NumericFormat } from 'react-number-format';

export const commissionColumns = [
  {
    title: 'Name',
    dataIndex: 'marketerName',
    key: 'marketerName',
  },

  {
    title: 'Sale No.',
    dataIndex: 'saleNumber',
    key: 'saleNumber',
    width: 110,
  },
  {
    title: 'Sale Date',
    dataIndex: 'saleDate',
    key: 'saleDate',
    width: 130,
  },
  {
    title: 'Sale Type',
    dataIndex: 'saleType',
    key: 'saleType',
    width: 110,
    render: (text, row) => (
      <Tag color={text === 'Cash' ? '#87d068' : '#2db7f5'}>{text}</Tag>
    ),
  },

  {
    title: 'Sale Amount',
    dataIndex: 'saleAmount',
    key: 'saleAmount',
    align: 'right',
    width: 110,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            displayType={'text'}
            style={{ color: '#108ee9' }}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Sale Deposit',
    dataIndex: 'saleDeposit',
    key: 'saleDeposit',
    align: 'right',
    width: 110,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            displayType={'text'}
            style={{ color: 'green' }}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Commission Amount',
    dataIndex: 'commissionAmount',
    key: 'commissionAmount',
    align: 'right',
    width: 150,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            displayType={'text'}
            style={{ color: '#2db7f5' }}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Pay Out Amount',
    dataIndex: 'payOutAmount',
    key: 'payOutAmount',
    align: 'right',
    width: 130,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            displayType={'text'}
            style={{ color: '#87d068' }}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    title: 'Pay Out Balance',
    dataIndex: 'payOutBalance',
    key: 'payOutBalance',
    align: 'right',
    width: 130,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
            displayType={'text'}
            style={{ color: '#f50' }}
            thousandSeparator={true}
          />
        ) : (
          '-'
        )}
      </>
    ),
  },
];

export const marketersColumns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Second Name',
    dataIndex: 'otherNames',
    key: 'otherNames',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Email',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
  },
  // {
  //    title: 'Status',
  //    dataIndex: 'status',
  //    key: 'status',
  //

  //  },
];

export const leadManagementColumns=[
  {
    title: 'Lead Source',
    dataIndex: 'leadSource',
    key: 'leadSource',
  },
  {
    title: 'Lead Status',
    dataIndex: 'leadStatus',
    key: 'leadStatus',
  },
  {
    title: 'Lead Owner',
    dataIndex: 'leadOwner',
    key: 'leadOwner',
  },
  {
    title: 'Lead Priority',
    dataIndex: 'leadPriority',
    key: 'leadPriority',
  },
  {
    title: 'Lead Contact No',
    dataIndex: 'leadContactNo',
    key: 'leadContactNo',
  },
  {
    title: 'Lead Email Address',
    dataIndex: 'leadEmailAddress',
    key: 'leadEmailAddress',
  },
  {
    title: 'Lead Contact Person',
    dataIndex: 'leadContactPerson',
    key: 'leadContactPerson',
  }, 
  {
    title: 'Desired Block/Phase',
    dataIndex: 'leadBlockPhase',
    key: 'leadBlockPhase',
  },
  {
    title: 'Follow Up Action',
    dataIndex: 'followUpAction',
    key: 'followUpAction',
  }

];

