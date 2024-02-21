import { Button, Card, Col, Dropdown, Space, Table, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { leadManagementColumns } from './columns';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDown } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { marketerService } from '../../../_services/marketer.service';
import { leadService } from '../../../_services/lead.service';
import axios from 'axios';


const Ftleads = () => {
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
  });

  const columns = [
    ...leadManagementColumns,
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
    setIsLoading(true)
    axios.get('http://localhost:8000/leads')
    .then((e)=>{setLeads(e.data);
          setIsLoading(false)}
          );

  }, []);

  const handleMenuClick = (key, data) => {
    switch (key) {
      case 'EDIT':
        navigate('/marketers/leads', { state: { record: data } });
        break;

      case 'DELETE':
        leadService.deleteLead(data);
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
    {
      key: 'DELETE',
      label: (
        <>
          <CiEdit style={{ color: '#2db7f5', marginTop: '-2px' }} /> Delete
        </>
      ),
    },
  ];

  return (
    <div id='content'>
      <Card
        type='inner'
        title='Leads'
        extra={
          <Button
            size='small'
            type='primary'
            onClick={() => navigate('/marketers/leads')}
          >
            New Lead
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={leads}
              rowKey={(record) => record.id}
              scroll={{ x: '990px' }}
              size='small'
              loading={isLoading}
              columns={columns}
              onChange={console.log("Hello")}
              onClick={console.log("Hello")}
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

export default Ftleads;
