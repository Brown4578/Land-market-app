import { Button, Card, Col, Dropdown, Row, Select, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { codesColumns } from './Columns';
import { useEffect, useState } from 'react';
import { AddButton } from '../../../common/AddButton';
import { codesService } from '../../../../../_services';
import { AiOutlineDown, AiOutlineEdit } from 'react-icons/ai';
import { BackArrow } from '../../../common/BackArrow';

const { Option } = Select;

const CodesTable = () => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [codeTypes, setCodeTypes] = useState([]);

  const columns = [
    ...codesColumns,
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
    fetchCodeTypes();
  }, []);

  useEffect(() => {
    fetchCodes(searchParams);
  }, [searchParams]);

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

  const fetchCodeTypes = () => {
    setIsLoading(true);
    codesService
      .fetchCodeTypes()
      .then((response) => {
        const codeTypes = response?.data;
        setCodeTypes(codeTypes);
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
        navigate('/system-settings/update-parameter', { state: { data } });
        break;

      default:
        break;
    }
  };

  const selectCode = (
    <Row>
      <Col span={12}>
        <Select
          placeholder='Select code type'
          style={{ width: '100%' }}
          onChange={(e) => handleCodeChange(e)}
        >
          {codeTypes.map((codeType) => (
            <Option key={codeType} value={codeType}></Option>
          ))}
        </Select>
      </Col>
    </Row>
  );

  const handleTableChange = (e) => {
    let current_page = { pageNo: e.current - 1, pageSize: e.pageSize };
    let params = {
      ...searchParams,
      ...current_page,
    };
    setSearchParams(params);
    setPage(current_page);
  };

  return (
    <div id='content'>
      <Card
        className='card-content'
        title={
          <>
            <BackArrow /> Parameters
          </>
        }
        extra={
          <AddButton text='Add Value' url='/system-settings/new-parameter' />
        }
      >
        <Table
          title={() => selectCode}
          columns={columns}
          dataSource={dataSource}
          rowKey='id'
          size='small'
          // onChange={handleTableChange}
          pagination={{
            pageSize: page.pageSize,
            // total: totalElements,
            total: dataSource.length,
            current: page.pageNo + 1,
          }}
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

export default CodesTable;
