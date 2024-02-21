import React from 'react';
import { Badge, Popover, Table } from 'antd';

export const propertySearchColumns = [
  {
    title: 'Holders',
    dataIndex: 'memberFullName',
    key: 'memberFullName',
    align: 'center',
    render: (text, record) => {
      const propertyHolders = record?.memberBasicDetails || [];

      return (
        <>
          {propertyHolders.length === 0 ? (
            <>
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
                count={propertyHolders.length}
                style={{
                  backgroundColor:
                    propertyHolders.length === 0 ? '#f50' : '#108ee9',
                }}
              />
            </>
          ) : (
            <Popover
              title={'Property Holder(s)'}
              placement='rightTop'
              content={
                <>
                  <Table
                    dataSource={propertyHolders}
                    columns={propertyHoldersColumns}
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
                count={propertyHolders.length}
                style={{
                  backgroundColor:
                    propertyHolders.length === 0 ? '#f50' : '#108ee9',
                }}
              />
            </Popover>
          )}
        </>
      );
    },
    width: 70,
  },
  {
    title: 'Ballot No.',
    dataIndex: 'plotNumber',
    key: 'plotNumber',
    width: 90,
  },
  {
    title: 'Certificate No.',
    dataIndex: 'certificateNumber',
    key: 'certificateNumber',
    width: 120,
  },
  {
    title: 'Title No.',
    dataIndex: 'titleNumber',
    key: 'titleNumber',
    width: 100,
    render: (text) => <>{text ? text : '-'}</>,
  },

  {
    title: 'Block',
    dataIndex: 'blockName',
    key: 'blockName',
    render: (text) => <>{text ? text : '-'}</>,
    width: 240,
  },
  {
    title: 'Phase',
    dataIndex: 'phaseName',
    key: 'phaseName',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
    width: 150,
  },
  // {
  //   title: 'Ballot No.',
  //   dataIndex: 'ballotNumber',
  //   key: 'ballotNumber',
  // },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
    render: (text) => <>{text ? text : '-'}</>,
    // width: 150,
  },
];

export const fileLocationsColumns = [
  {
    title: 'Cert No.',
    dataIndex: 'certNo',
    key: 'certNo',
  },
  {
    title: 'File Location',
    dataIndex: 'directoryName',
    key: 'directoryName',
    render: (text, row) => <span>{`${text}/${row.fileName}`}</span>,
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

export const propertyHoldersColumns = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text) => <>{text ? text : '-'}</>,
    // width: 240,
  },
  {
    title: 'Phone No.',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    render: (text) => <>{text ? text : '-'}</>,
    // width: 240,
  },
  {
    title: 'Email Address',
    dataIndex: 'emailAddress',
    key: 'emailAddress',
    render: (text) => <>{text ? text : '-'}</>,
    // width: 240,
  },
];
