import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Space, Tag, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { plotService } from '../../../../_services';
import { propertySearchColumns } from '../../../PropertySearch/components/columns';
import { MdOutlineEditNote } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { debounce } from 'lodash';
import { AiOutlineEye } from 'react-icons/ai';

const { Option } = Select;

const PlotsView = (props) => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [currentActiveSelection, setCurrentActiveSelection] =
    useState('generalSearch');

  const columns = [
    ...propertySearchColumns,
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 95,
      render: (text, row) => (
        <div className='d-flex justify-content-start'>
          <Space size={[0, 8]} wrap>
            <Tag
              color='#2db7f5'
              title='Edit'
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigateToUpdatePlotDetails(row)}
            >
              <MdOutlineEditNote
                style={{ fontSize: '15px', marginTop: '-2px' }}
              />
            </Tag>
            <Tag
              color='#87d068'
              title='View Files (Coming soon)'
              style={{ cursor: 'pointer' }}
              // onClick={() => handleNavigateToViewPlotsFiles(row)}
            >
              <AiOutlineEye style={{ fontSize: '15px', marginTop: '-2px' }} />
            </Tag>
          </Space>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPlotDetails(searchParams);
  }, [searchParams]);

  const getPlotDetails = (params) => {
    setLoading(true);
    setData([]);
    plotService
      .fetchPlots(params)
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

  const handleNavigateToCreateNewPlot = () => {
    navigate('/new-plot', { state: { isNewPlot: true } });
  };

  const handleNavigateToUpdatePlotDetails = (data) => {
    navigate('/edit-plot', { state: { isNewPlot: false, record: data } });
  };

  const handleNavigateToViewPlotsFiles = (data) => {
    navigate('/plot-files', { state: { record: data } });
  };

  const handleTitleStatus = (e) => {
    setSearchParams((prev) => ({ ...prev, isTitlePresent: e }));
  };

  const handleSpecializedSearch = debounce((e) => {
    switch (currentActiveSelection) {
      case 'generalSearch':
        setSearchParams((prev) => ({
          ...prev,
          term: e.target?.value || null,
          plotNo: null,
          idNumber: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'plotNo':
        setSearchParams((prev) => ({
          ...prev,
          plotNo: e.target?.value || null,
          term: null,
          idNumber: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'idNumber':
        setSearchParams((prev) => ({
          ...prev,
          idNumber: e.target?.value || null,
          plotNo: null,
          term: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'certNo':
        setSearchParams((prev) => ({
          ...prev,
          certNo: e.target?.value || null,
          idNumber: null,
          plotNo: null,
          term: null,
          titleNumber: null,
        }));
        break;
      case 'titleNumber':
        setSearchParams((prev) => ({
          ...prev,
          titleNumber: e.target?.value || null,
          certNo: null,
          idNumber: null,
          plotNo: null,
          term: null,
        }));
        break;

      default:
        break;
    }
  }, 800);

  const selectBefore = (
    <Select
      defaultValue={currentActiveSelection}
      value={currentActiveSelection}
      onChange={(e) => setCurrentActiveSelection(e)}
      dropdownStyle={{ width: '205' }}
      popupMatchSelectWidth={false}
    >
      <Option value='generalSearch' style={{ color: 'rgba(0, 0, 0 ,.5' }}>
        - General Search -
      </Option>
      <Option value='plotNo'>Plot No.</Option>
      <Option value='idNumber'>ID No.</Option>
      <Option value='certNo'>Certificate No.</Option>
      <Option value='titleNumber'>Title No.</Option>
    </Select>
  );

  return (
    <Card
      type='inner'
      title='Plots Register'
      extra={
        <>
          <Button
            type='primary'
            size='small'
            onClick={() => handleNavigateToCreateNewPlot()}
          >
            New Plot
          </Button>
        </>
      }
    >
      <Row gutter={[10, 14]}>
        <Col span={24} className='m-0 p-0'>
          <Row gutter={[8, 10]}>
            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
              <Input
                addonBefore={selectBefore}
                allowClear
                onChange={(e) => handleSpecializedSearch(e)}
              />
            </Col>
            <Col xl={8} lg={10} md={12} sm={24} xs={24}>
              <Select
                allowClear
                placeholder='Select title no. status'
                onChange={(e) => handleTitleStatus(e)}
                style={{ width: '100%' }}
              >
                <Option value={null} style={{ color: 'rgba(0, 0, 0 ,.5' }}>
                  - Select status -
                </Option>
                <Option value={true}>Has title number</Option>
                <Option value={false}>Has no title number</Option>
              </Select>
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
              x: 1150,
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

export default PlotsView;
