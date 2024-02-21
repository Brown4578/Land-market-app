import { Badge, Popover, Table, Tag } from 'antd';
import { NumericFormat } from 'react-number-format';
import { generateColor } from '../../../../_helpers/utils/StringManipulator';

const propertyBasicDataColumns = [
  {
    title: 'Block Name',
    dataIndex: 'blockName',
    key: 'blockName',
  },
  {
    title: 'Phase Name',
    dataIndex: 'phaseName',
    key: 'phaseName',
  },
  {
    title: 'Property Number',
    dataIndex: 'propertyNumber',
    key: 'propertyNumber',
  },
];
const memberBasicDataColumns = [
  {
    title: 'Member',
    dataIndex: 'fullName',
    key: 'fullName',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Id Number',
    dataIndex: 'idNumber',
    key: 'idNumber',
  },
];

export const purchaseAgreementColumns = [
  {
    title: 'Agreement No.',
    dataIndex: 'agreementNumber',
    key: 'agreementNumber',
    width: 120,
  },
  {
    title: 'Purchase Price',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    width: 115,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'Effective Date',
    dataIndex: 'effectiveDate',
    key: 'effectiveDate',
    width: 150,
    align: 'center',
  },

  {
    title: 'Purchase Type',
    dataIndex: 'purchaseType',
    key: 'purchaseType',
    width: 150,
    align: 'center',
    render: (text) => <Tag color={generateColor(text)}>{text}</Tag>,
  },
  {
    title: 'Deposit Amount',
    dataIndex: 'depositAmount',
    key: 'depositAmount',
    width: 127,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'No of Instl',
    dataIndex: 'numberOfInstallments',
    key: 'numberOfInstallments',
    align: 'center',
    width: 150,
    render: (text) => text ?? '-',
  },
  {
    title: 'Running Balance',
    dataIndex: 'runningBalance',
    key: 'runningBalance',
    width: 125,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'First Instl Date',
    dataIndex: 'firstInstallmentDate',
    key: 'firstInstallmentDate',
    align: 'center',
    width: 150,
    render: (text) => text ?? '-',
  },
  {
    title: 'Next Instl Date',
    dataIndex: 'nextInstallmentDate',
    key: 'nextInstallmentDate',
    align: 'center',
    width: 150,
    render: (text) => text ?? '-',
  },
  {
    title: 'Instl. Amount',
    dataIndex: 'installmentAmount',
    key: 'installmentAmount',
    width: 120,
    align: 'right',
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'Instl. Mode',
    dataIndex: 'modeOfInstallment',
    key: 'modeOfInstallment',
    align: 'center',
    width: 150,
    render: (text) => <Tag color={generateColor(text)}>{text}</Tag> || '-',
  },
  {
    title: 'Marketer',
    dataIndex: 'saleAgreementOwnerName',
    key: 'saleAgreementOwnerName',
    // width: 150,
  },

  {
    title: 'Property(s)',
    dataIndex: 'property',
    key: 'propertyBasicData',
    width: 100,
    align: 'center',
    render: (text, record) => {
      const allProperties = record?.propertyBasicData || [];
      return (
        <Popover
          title={null}
          content={
            <>
              <Table
                dataSource={allProperties}
                columns={propertyBasicDataColumns}
                size='small'
                bordered
                pagination={false}
                rowKey={(record) => record.id}
              />
            </>
          }
        >
          <style>
            {`
        
          .ant-badge-count {
            pointer-events: none;
          }
        `}
          </style>
          <Badge
            title=''
            showZero
            count={allProperties?.length}
            style={{ backgroundColor: 'purple' }}
          />
        </Popover>
      );
    },
  },
  {
    title: 'Member(s)',
    dataIndex: 'member',
    key: 'memberBasicData',
    width: 100,
    align: 'center',
    render: (text, record) => {
      const allMembers = record?.memberBasicData || [];
      return (
        <Popover
          title={null}
          content={
            <>
              <Table
                dataSource={allMembers}
                columns={memberBasicDataColumns}
                size='small'
                bordered
                pagination={false}
                rowKey={(record) => record.id}
              />
            </>
          }
        >
          <style>
            {`
        
          .ant-badge-count {
            pointer-events: none;
          }
        `}
          </style>
          <Badge
            title=''
            showZero
            count={allMembers?.length}
            style={{ backgroundColor: '#87d068' }}
          />
        </Popover>
      );
    },
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
  },
];

export const minifiedPurchaseAgreementColumns = [
  {
    title: 'Agreement No.',
    dataIndex: 'agreementNumber',
    key: 'agreementNumber',
    // width: 100,
  },
  {
    title: 'Purchase Price',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    // width: 100,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'Running Balance',
    dataIndex: 'runningBalance',
    key: 'runningBalance',
    // width: 100,
    render: (text, row) => (
      <>
        {text ? (
          <NumericFormat
            value={text}
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
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
  },
];
