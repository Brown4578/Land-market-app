import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { blockColumns } from './columns';
// import { MdOutlineDeleteForever, MdOutlineEditNote } from 'react-icons/md';
import { blockService } from '../../../_services';
import { validatePermission } from '../../../_helpers/globalVariables';

const BlockView = () => {
  const navigate = useNavigate();
  const defaultPage = { page: 1, pageSize: 10 };
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(defaultPage);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = (params) => {
    setIsLoading(true);
    blockService
      .fetchBlocks(params)
      .then((resp) => {
        let content = resp.data?.body ?? [];
        setDataSource(content);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const columns = [
    ...blockColumns,
    // {
    //   title: null,
    //   dataIndex: 'action',
    //   key: 'action',
    //   width: '8%',
    //   render: (text, row) => (
    //     <div className='d-flex justify-content-start'>
    //       <Space size={[0, 8]} wrap>
    //         <Tag
    //           color='#2db7f5'
    //           title='Edit'
    //           style={{ cursor: 'pointer' }}
    //           onClick={() => handleNavigateToUpdateBlock(row)}
    //         >
    //           <MdOutlineEditNote
    //             style={{ fontSize: '15px', marginTop: '-2px' }}
    //           />
    //         </Tag>
    //         <Tag color='#f50' title='Delete' style={{ cursor: 'pointer' }}>
    //           <MdOutlineDeleteForever
    //             style={{ fontSize: '15px', marginTop: '-2px' }}
    //           />
    //         </Tag>
    //       </Space>
    //     </div>
    //   ),
    // },
  ];

  const handleNavigateToCreateNewBlock = () => {
    navigate('/new-block', { state: { isNewBlock: true } });
  };
  const handleNavigateToUpdateBlock = (data) => {
    navigate('/edit-block', { state: { isNewBlock: false, record: data } });
  };

  return (
    <Card
      title='Blocks Register'
      type='inner'
      extra={
        validatePermission('create_block') && (
          <>
            <Button
              type='primary'
              size='small'
              onClick={() => handleNavigateToCreateNewBlock()}
            >
              New Block
            </Button>
          </>
        )
      }
    >
      <Row>
        <Col span={24}>
          <Table
            dataSource={dataSource}
            loading={isLoading}
            columns={columns}
            size='small'
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default BlockView;
