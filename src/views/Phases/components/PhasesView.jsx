import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Select, DatePicker, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { phaseColumns } from './columns';
import {
  GiPayMoney,
  GiProfit,
  GiReceiveMoney,
  GiTakeMyMoney,
} from 'react-icons/gi';
import { blockService, phaseService } from '../../../_services';
import './index.css';
import { MdAttachMoney, MdMoneyOff } from 'react-icons/md';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { NumericFormat } from 'react-number-format';
import { convertToLowerThenCapitalize } from '../../../_helpers/utils/StringManipulator';
import { GoSearch } from 'react-icons/go';
import { debounce } from 'lodash';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

const PhasesView = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState();
  const defaultSummaryValues = {
    totalPurchasePrice: 0,
    totalExpenses: 0,
    grossProfit: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCredit: 0,
  };
  const [summaryValues, setSummaryValues] = useState(defaultSummaryValues);
  const columns = [...phaseColumns];

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    fetchPhases(searchParams);
  }, [searchParams]);

  const fetchBlocks = (params) => {
    setBlocks([]);
    blockService.fetchBlocks(params).then((resp) => {
      let content = resp.data?.body || [];
      setBlocks(content);
    });
  };

  const fetchPhases = (params) => {
    setIsLoading(true);
    phaseService
      .fetchPhases(params)
      .then((resp) => {
        let content = resp.data?.body?.content ?? [];
        setDataSource(content);
        calculateSummaryValues(content);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const calculateSummaryValues = (data) => {
    const summaryValues = data.reduce(
      (acc, phase) => {
        acc.totalPurchasePrice += phase.salesSummary?.totalPurchasePrice || 0;
        acc.totalExpenses += phase.salesSummary?.totalExpenses || 0;
        acc.totalSales += phase.salesSummary?.totalSales || 0;
        acc.grossProfit += phase.salesSummary?.grossProfit || 0;
        acc.totalRevenue += phase.salesSummary?.totalRevenue || 0;
        acc.totalCredit += phase.salesSummary?.totalCredit || 0;
        return acc;
      },
      {
        totalPurchasePrice: 0,
        totalExpenses: 0,
        totalSales: 0,
        grossProfit: 0,
        totalRevenue: 0,
        totalCredit: 0,
      }
    );

    setSummaryValues(summaryValues);
  };

  const handleNavigateToCreateNewPhase = () => {
    navigate('/new-phase', { state: { isNewPhase: true } });
  };
  const handleBlockSearch = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, blockId: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, blockId: null }));
    }
  };
  const handleRange = (data) => {
    if (data && !data.length < 1) {
      let date = `${data[0].format(dateFormat)}..${data[1].format(dateFormat)}`;

      let params = {
        ...searchParams,
        dateRange: date,
      };
      setSearchParams(params);
    } else {
      let params = {
        ...searchParams,
        dateRange: null,
      };
      setSearchParams(params);
    }
  };

  const handleGeneralSearch = debounce((val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, term: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, term: null }));
    }
  }, 800);
  return (
    <Card
      title='Phases Register'
      type='inner'
      extra={
        <>
          <Button
            type='primary'
            size='small'
            onClick={() => handleNavigateToCreateNewPhase()}
          >
            New phase
          </Button>
        </>
      }
    >
      <PerfectScrollbar style={{ height: '64vh' }}>
        <Row gutter={[12, 12]}>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <Select
              showSearch
              allowClear
              placeholder='Select a block'
              optionFilterProp='children'
              onChange={handleBlockSearch}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                (option?.searchLabel ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={blocks.map((block) => {
                return {
                  value: block.id,
                  searchLabel: block?.blockName,
                  label: (
                    <>
                      {(block?.blockName &&
                        convertToLowerThenCapitalize(block.blockName)) ||
                        ''}
                      {` - `}
                      {(block?.county &&
                        convertToLowerThenCapitalize(block.county)) ||
                        ''}
                      {` - `}
                      {(block?.subCounty &&
                        convertToLowerThenCapitalize(block.subCounty)) ||
                        ''}
                    </>
                  ),
                };
              })}
            />
          </Col>
          <Col xl={6} lg={6} md={12} sm={24} xs={24} >
            <Input
              prefix={<GoSearch />}
              allowClear
              placeholder='Search...'
              style={{ width: '100%' }}
              onChange={(e) => handleGeneralSearch(e.target.value)}
            />
          </Col>
          <Col xxl={6} xl={6} lg={6} md={12} sm={24} xs={24}>
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              onChange={handleRange}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row className='mt-1' gutter={12}>
          <Col span={24}>
            <Table
              scroll={{
                x: 1550,
              }}
              dataSource={dataSource}
              columns={columns}
              loading={isLoading}
              size='small'
              rowKey={(record) => record.id}
              pagination={false}
            />
          </Col>
        </Row>
      </PerfectScrollbar>
      <div
        style={{
          backgroundColor: '#f3f3f3',
          borderRadius: '10px',
          padding: '8px',
        }}
      >
        <Row gutter={[16, 16]}>
          <>
            <Col xxl={4} xl={4} lg={4} md={12} sm={24}>
              <div class='summary box-one'>
                <div className='left-panel'>
                  <h6>Total Purchase Price</h6>
                  <GiTakeMyMoney
                    color='#564f63'
                    style={{ fontSize: '33px', float: 'right' }}
                  />
                  <div className='count'>
                    <NumericFormat
                      value={summaryValues.totalPurchasePrice}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={12} sm={24} xs={24}>
              <div class='summary box-five'>
                <div className='left-panel'>
                  <h6>Total Revenue</h6>
                  <MdAttachMoney
                    color='green'
                    style={{ fontSize: '40px', float: 'right' }}
                  />
                  <div className='count'>
                    <NumericFormat
                      value={summaryValues.totalRevenue}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
            </Col>{' '}
            <Col xxl={4} xl={4} lg={4} md={12} sm={24} xs={24}>
              <div class='summary box-six'>
                <h6>Total Credits</h6>
                <MdMoneyOff
                  color='#4646ab'
                  style={{ fontSize: '40px', float: 'right' }}
                />
                <div className='count'>
                  <NumericFormat
                    value={summaryValues.totalCredit}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                </div>
              </div>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={12} sm={24} xs={24}>
              <div class='summary box-two'>
                <div className='left-panel'>
                  <h6>Total Sales</h6>
                  <FaMoneyBillTrendUp
                    color='#5b606b'
                    style={{ fontSize: '33px', float: 'right' }}
                  />
                  <div className='count'>
                    <NumericFormat
                      value={summaryValues.totalSales}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={12} sm={24} xs={24}>
              <div class='summary box-three'>
                <div className='left-panel'>
                  <h6>Total Expenses </h6>
                  <GiPayMoney
                    color='#665744'
                    style={{ fontSize: '33px', float: 'right' }}
                  />
                  <div className='count'>
                    <NumericFormat
                      value={summaryValues.totalExpenses}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
            </Col>{' '}
            <Col xxl={4} xl={4} lg={4} md={12} sm={24} xs={24}>
              <div class='summary box-four'>
                <div className='left-panel'>
                  <h6>Gross Profit</h6>

                  <GiProfit
                    color='green'
                    style={{ fontSize: '40px', float: 'right' }}
                  />
                  <div className='count'>
                    <NumericFormat
                      value={summaryValues.grossProfit}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
            </Col>{' '}
          </>
        </Row>
      </div>
    </Card>
  );
};

export default PhasesView;
