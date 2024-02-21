import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Space,
  Tag,
  Input,
  Modal,
  Descriptions,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { plotTransferService } from '../../../_services';
import { transferColumns } from './columns';
import { AiOutlineEye } from 'react-icons/ai';
import { GoSearch } from 'react-icons/go';
import { debounce } from 'lodash';

const TransferHistoryView = (props) => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [modal, contextHolder] = Modal.useModal();

  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [clickedRow, setClickedRow] = useState(null);

  useEffect(() => {
    getPlotTransfers(searchParams);
  }, [searchParams]);

  const columns = [
    ...transferColumns,
    {
      title: 'Plot',
      dataIndex: 'plotData',
      key: 'plotData',
      width: '10%',
      render: (text, row) => (
        <>
          {clickedRow === row.id ? (
            <Tag color='cyan'>Viewing</Tag>
          ) : (
            <>
              {text.plotNumber}
              <AiOutlineEye
                title='View more'
                style={{
                  marginLeft: '10px',
                  color: '#2db7f5',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  plotInfo(text);
                  setClickedRow(row.id);
                }}
              />
            </>
          )}
        </>
      ),
    },
  ];

  const plotInfo = (data) => {
    modal.info({
      title: 'Plot Details',
      content: (
        <Descriptions
          bordered
          size='small'
          column={{
            xxl: 2,
            xl: 1,
            lg: 1,
            md: 1,
            sm: 1,
            xs: 1,
          }}
        >
          <Descriptions.Item label='Plot No.'>
            {data?.plotNumber}
          </Descriptions.Item>
          <Descriptions.Item label='Block'>{data?.blockName}</Descriptions.Item>
          <Descriptions.Item label='Phase'>{data?.phaseName}</Descriptions.Item>

          <Descriptions.Item label='Ballot No.'>
            {data?.ballotNumber}
          </Descriptions.Item>
          <Descriptions.Item label='Certificate No.'>
            {data?.certificateNumber ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Title No.'>
            {data?.titleNumber ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label='File Location'>
            {data?.fileLocation ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      ),
      okText: 'Ok',
      onOk: () => {
        setClickedRow(null);
      },
    });
  };

  const getPlotTransfers = (params) => {
    setLoading(true);
    setData([]);
    plotTransferService
      .fetchTransfers(params)
      .then((resp) => {
        let body = resp.data.body;
        let content = body?.content ?? [];
        let pagination = body?.pagination ?? null;
        setData(content);
        setTotalElements(pagination?.totalElements ?? 0);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleGeneralSearch = debounce((val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, term: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, term: null }));
    }
  }, 800);

  const handleTableChange = (data) => {
    let current_page = { pageNo: data?.current - 1, pageSize: data?.pageSize };
    let params = {
      ...searchParams,
      ...current_page,
    };
    setPage(current_page);
    setSearchParams(params);
  };

  const handleNavigateToCreateNewPlotTransfer = () => {
    navigate('/new-plot-transfer');
  };

  return (
    <Card
      type='inner'
      title='Plot Transfers'
      extra={
        <>
          <Button
            type='primary'
            size='small'
            onClick={() => handleNavigateToCreateNewPlotTransfer()}
          >
            New Plot Transfer
          </Button>
        </>
      }
    >
      {contextHolder}
      <Row gutter={[10, 14]}>
        <Col span={24} className='m-0 p-0'>
          <Row gutter={[8]}>
            <Col xl={6} lg={8} md={10} sm={12} xs={24}>
              <Input
                prefix={<GoSearch />}
                allowClear
                placeholder='Search...'
                style={{ width: '100%' }}
                onChange={(e) => handleGeneralSearch(e.target.value)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            size='small'
            onChange={handleTableChange}
            loading={isLoading}
            pagination={{
              total: totalElements,
              current: page.pageNo + 1,
              pageSize: page.pageSize,
            }}
            scroll={{
              y: 410,
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

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

export default TransferHistoryView;
