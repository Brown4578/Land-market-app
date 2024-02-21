import React, { useEffect, useState } from 'react';

import { EditOutlined } from '@ant-design/icons';
import { Row, Col, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { UsersColumns } from './colums';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { userService } from '../../../../../_services';

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const defaultPage = { page: 1, size: 10 };
  const [page, setPage] = useState(defaultPage);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
  });
  const [total_elements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    ...UsersColumns,

    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: 40,
      render: (text, record, index) => (
        <Row gutter={[7, 10]} className='d-flex' key={index}>
          <Col span={8}>
            <EditOutlined
              title='Edit'
              onClick={() => {
                navigate('/user-management/user/edit-user', {
                  state: { record, isAddNew: false },
                });
              }}
              style={{ cursor: 'pointer', color: '#1089ff', opacity: '0.85' }}
            />
          </Col>
        </Row>
      ),
      fixed: 'right',
    },
  ];

  useEffect(() => {
    getUsers(searchParams);
  }, [searchParams]);

  const getUsers = (params) => {
    setLoading(true);
    userService
      .fetchUsers(params)
      .then((resp) => {
        let content = resp.data.body || [];

        setUsers(content);
        setTotalElements(content.length);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleTableChange = (data) => {
    let current_page = {
      page: Number(data?.current),
      size: data?.size,
    };
    setPage(current_page);
    setSearchParams((prev) => ({ ...prev, ...current_page }));
  };

  const handleGeneralSearch = debounce((value) => {
    setSearchParams((prev) => ({ ...prev, term: value }));
  }, 800);

  return (
    <div>
      <Row className='mt-2'>
        <Col span={24}>
          <PerfectScrollbar style={{ height: '70vh' }}>
            <Table
              size={'small'}
              onChange={handleTableChange}
              columns={columns}
              dataSource={users}
              title={() => (
                <Col span={6} key={Math.random()}>
                  <Input
                    placeholder='Search...'
                    onChange={(e) => handleGeneralSearch(e.target.value)}
                  />
                </Col>
              )}
              loading={isLoading}
              rowKey={(record) => record.id}
              scroll={{ x: 1000 }}
              pagination={{
                current: page?.page,
                size: page.size,
                total: total_elements,
                pageSizeOptions: [
                  '20',
                  '50',
                  '100',
                  '200',
                  '500',
                  '1000',
                  '2000',
                  '3000',
                  '5000',
                  '10000',
                ],
                showSizeChanger: true,
                locale: { items_per_page: '' },
              }}
            />
          </PerfectScrollbar>
        </Col>
      </Row>
    </div>
  );
};
export default Users;
