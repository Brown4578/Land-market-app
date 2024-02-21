import { Button, Card, Col, Dropdown, Row, Select, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { accountsInterfaceColumns } from './Columns';
import { useEffect, useState } from 'react';
import { accountingService, codesService } from '../../../../../_services';
import { AiOutlineDown, AiOutlineEdit } from 'react-icons/ai';
import { BackArrow } from '../../../common/BackArrow';
const { Option } = Select;

const AccountInterphaseTable = () => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [accountInterfaces, setAccountsInterfaces] = useState([]);

  const columns = [
    ...accountsInterfaceColumns,
    {
      title: <span>Actions</span>,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, row) => (
        <>
          <Dropdown
            menu={{
              items: dropDownItems,
              onClick: (e) => handleMenuClick(e.key, row),
            }}
          >
            <Button size='small'>
              <Space>
                Actions
                <AiOutlineDown />
              </Space>
            </Button>
          </Dropdown>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchAccountsInterface();
  }, []);

  const fetchCodes = (params) => {
    setIsLoading(true);
    codesService
      .fetchCodes(params)
      .then((response) => {
        const respData = response?.data || [];

        setDataSource(respData);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const fetchAccountsInterface = () => {
    setIsLoading(true);
    accountingService
      .getAccountsInterface()
      .then((response) => {
        const accountInterfaces = response?.data?.body || [];
        setAccountsInterfaces(accountInterfaces);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleCodeChange = (e) => {
    setSearchParams((prev) => ({ ...prev, type: e }));
  };

  const handleMenuClick = (key, data) => {
    switch (key) {
      case 'EDIT':
        navigate('/system-settings/accounts-interface/update', {
          state: { data },
        });
        break;

      default:
        break;
    }
  };

  return (
    <div id='content'>
      <Card
        className='card-content'
        title={
          <>
            <BackArrow /> Accounts Interface
          </>
        }
      >
        <Table
          columns={columns}
          dataSource={accountInterfaces}
          rowKey={() => Math.random()}
          size='small'
          scroll={{
            x: 1100,
          }}
        />
      </Card>
    </div>
  );
};

const dropDownItems = [
  {
    key: 'EDIT',
    label: (
      <>
        <AiOutlineEdit style={{ color: '#0a58ca', marginTop: '-6px' }} /> Edit
      </>
    ),
  },
];

export default AccountInterphaseTable;
