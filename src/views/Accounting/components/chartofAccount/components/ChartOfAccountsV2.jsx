import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Dropdown, Menu, Row, Space } from 'antd';
import { accountingService } from '../../../../../_services';
import { useNavigate, Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const dropDownItems = [
  { key: 'ALL', label: 'All Accounts' },
  { key: 'ASSET', label: 'Asset Accounts' },
  { key: 'LIABILITY', label: 'Liability Accounts' },
  { key: 'REVENUE', label: 'Income Accounts' },
  { key: 'EXPENSE', label: 'Expense Accounts' },
];

const ChartOfAccounts = (props) => {
  const navigate = useNavigate();
  const start_page = { page: 0, pageSize: 20 };
  const [searchParams, setSearchParams] = useState(start_page);
  const [page, setPage] = useState(start_page);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState({});
  const [filterAccount, setFilterAccount] = useState('ALL');
  const [arrayLevel, setArrayLevel] = useState([]);

  useEffect(() => {
    setLoading(true);
    accountingService
      .getChartsOfAccountsV2(params)
      .then((res) => {
        const content = res?.data || [];

        findLevels(res.data);
        setAccounts(content);
        // findLevels(res.data.accounts)
        setTotalElements(res?.data || []);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [params]);

  const findLevels = (data) => {
    const maxLevel = Math.max(...data.map((el) => el.accountHierarchy.length));

    let arr = [];
    for (let x = 1; x <= maxLevel; x++) {
      arr.push(x);
      // if (x === maxLevel) {
      //   console.log('Max number:\t\t', x)
      // }
    }
    setArrayLevel(arr);
  };

  const findIndex = (arr, record) => {
    if (arr == null) {
      return -1;
    }
    let record_access = record.split('-').map(Number);
    let new_record_access = [];

    for (let t = 0; t < record_access.length; t++) {
      if (record_access[t] >= 10) {
        record_access[t] = 1;
      }

      new_record_access.push(record_access[t]);
    }
    let join_record_access = new_record_access.join('-');
    let level = join_record_access.length;
    let len = arr.length;
    let i = 0;

    while (i < len) {
      if (arr[i] === level) {
        if (level > 10) {
        }
        return i;
      } else {
        i = i + 1;
      }
    }
    return -1;
  };

  const newColumns = [
    {
      title: 'Account Number',
      dataIndex: 'accountIdentifier',
      key: 'accountIdentifier',
      width: 200,
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (e, record) => (
        <Button
          type='link'
          onClick={() =>
            navigate('/accounting/chart-of-accounts/details', {
              state: { accountIdentifier: record.accountIdentifier },
            })
          }
          style={{ textDecoration: 'none' }}
        >
          <div>
            <span
              style={{
                fontWeight:
                  (findIndex(arrayLevel, record.accountHierarchy) === 0 &&
                    'bolder') ||
                  (findIndex(arrayLevel, record.accountHierarchy) === 1 &&
                    'bold') ||
                  (findIndex(arrayLevel, record.accountHierarchy) >= 2 &&
                    'normal'),
              }}
            >
              <i
                className={
                  (findIndex(arrayLevel, record.accountHierarchy) === 0 &&
                    'fa fa-arrow-right') ||
                  (findIndex(arrayLevel, record.accountHierarchy) === 1 &&
                    'fa fa-angle-right') ||
                  (findIndex(arrayLevel, record.accountHierarchy) >= 2 &&
                    'fa fa-angle-right')
                }
                style={{
                  paddingLeft:
                    Number(
                      findIndex(arrayLevel, record.accountHierarchy) * 18
                    ) + `px`,
                }}
              ></i>{' '}
              {e}
            </span>
          </div>
        </Button>
      ),
    },
    {
      title: 'Running Balance',
      dataIndex: 'runningBalance',
      key: 'runningBalance',
      width: 150,
      align: 'right',
    },
  ];

  const handleFilterMenu = (e) => {
    setFilterAccount(e.key);
    let newParams = { ...params, type: e.key === 'ALL' ? '' : e.key };
    setParams(newParams);
  };

  const handleTableChange = (value) => {
    let current_page = { page: value.current, pageSize: value.pageSize };
    let params = { ...searchParams, ...current_page };
    setSearchParams(params);
    setPage(current_page);
  };
  return (
    <div id='content'>
      <Card
        title='Chart of Accounts'
        extra={[
          <Button
            type='primary'
            onClick={() => navigate('/accounting/chart-of-accounts/new')}
            key='1'
          >
            New Account
          </Button>,
        ]}
      >
        <Row type='flex' justify='space-between' className='mb-2'>
          <Dropdown
            menu={{
              items: dropDownItems,
              onClick: (e) => handleFilterMenu(e),
            }}
          >
            <Button size='small'>
              <Space>
                {filterAccount}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Row>
        <Table
          loading={loading}
          bordered={true}
          dataSource={accounts}
          onChange={handleTableChange}
          pagination={{
            total: totalElements,
            current: page.page + 1,
            pageSize: page.pageSize,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            showSizeChanger: true,
            locale: { items_per_page: '' },
          }}
          columns={newColumns}
          size='small'
          scroll={{ x: '650px' }}
          rowKey={(record) => Number(Math.random()) * Number(Math.random())}
        />
      </Card>
    </div>
  );
};
export default ChartOfAccounts;
