import { Button, Card, Col, Dropdown, Space, Table, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { marketersColumns } from './columns';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDown } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { marketerService } from '../../../_services/marketer.service';

const Marketers = () => {
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [marketers, setMarketers] = useState([]);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
  });

  const columns = [
    ...marketersColumns,
    {
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      title: <span className='table-title'>Actions</span>,
      width: 100,
      fixed: 'right',
      render: (_, row) => (
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
      ),
    },
  ];
  useEffect(() => {
    getMarketers(searchParams);
  }, [searchParams]);

  const getMarketers = (params) => {
    setIsLoading(true);
    marketerService
      .fetchMarketers(params)
      .then((resp) => {
        let body = resp.data.body;
        let content = body ?? [];
        let pagination = body?.pagination ?? null;
        setMarketers(content);

        setTotalElements(pagination?.totalElements ?? 0);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleTableChange = (value) => {
    let current_page = { page: value.current - 1, pageSize: 10 };
    let params = { ...searchParams, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleMenuClick = (key, data) => {
    switch (key) {
      case 'EDIT':
        navigate('/marketers/update', { state: { record: data } });
      default:
        break;
    }
  };

  const dropDownItems = [
    {
      key: 'EDIT',
      label: (
        <>
          <CiEdit style={{ color: '#2db7f5', marginTop: '-2px' }} /> Edit
        </>
      ),
    },
  ];

  return (
    <div id='content'>
      <Card
        type='inner'
        title='Marketers'
        extra={
          <Button
            size='small'
            type='primary'
            onClick={() => navigate('/marketers/new')}
          >
            New Marketer
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={marketers}
              rowKey={(record) => record.id}
              scroll={{ x: '990px' }}
              size='small'
              columns={columns}
              loading={isLoading}
              onChange={handleTableChange}
              onClick={handleTableChange}
              pagination={{
                current: page.pageNo + 1,
                pageSize: page.pageSize,
                total: totalElements,
              }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Marketers;
