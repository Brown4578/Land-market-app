import React, { useEffect, useState } from 'react';
import {
  Card,
  DatePicker,
  Button,
  Select,
  Row,
  Table,
  Col,
  Input,
  Space,
} from 'antd';
import { journalColumns } from './jlistcolumns';
import {
  journalService,
  TransactionService,
  reportsService,
} from '../../../../../_services';
import { validatePermission } from '../../../../../_helpers/globalVariables';
import { debounce } from 'lodash';
// import { AccountsSearch } from '_components/allSearch';
import JournalInfo from './JournalInfo';
import JournalInfoSkeleton from './JournalInfoSkeleton';
import {
  SearchOutlined,
  ArrowRightOutlined,
  SwapRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FiPrinter } from 'react-icons/fi';
import { fileDownload } from '../../../../../_helpers/globalVariables';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Journals = (props) => {
  const navigate = useNavigate();

  const start_page = { page: 1, pageSize: 10 };
  const [searchParams, setSearchParams] = useState(start_page);
  const [page, setPage] = useState(start_page);
  const [journals, setJournals] = useState([]);
  const [journalsFound, setJournalsFound] = useState(true);
  const [total_elements, setTotalElements] = useState(10);
  const [isLoading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentJournalEntryId, setCurrentJournalEntryId] = useState(null);

  const columns = [
    ...journalColumns,
    {
      title: '',
      dataIndex: 'status',
      key: 'status',
      width: '4%',
      render: (text, row) => (
        <>
          {currentJournalEntryId && currentJournalEntryId === row.id ? (
            <ArrowRightOutlined
              style={{ color: '#2db7f5' }}
              type='arrow-right'
            />
          ) : (
            <SwapRightOutlined style={{ color: '#c7c7c7' }} type='swap-right' />
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    let params = {
      ...searchParams,
      includeClosed: true,
    };
    getJournal(params);
  }, [searchParams]);

  const getJournal = async (params) => {
    setLoading(true);
    setCurrentJournalEntryId(null);
    try {
      let response = await journalService.fetchJournals(params);
      let data = response?.data || null;
      setJournals(data?.content || []);
      if (data?.content.length > 0) {
        setJournalsFound(true);
      } else {
        setJournalsFound(true);
      }
      setTotalElements(data?.page_details?.total_elements || 10);
      setLoading(false);

      if (data) {
        setTimeout(() => {
          let content = data?.content || [];
          if (content.length > 0) {
            setCurrentJournalEntryId(content[0]?.id);
          } else {
            setCurrentJournalEntryId(null);
          }
        }, 1500);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionTypes();
  }, []);

  const getTransactionTypes = async (params) => {
    try {
      let response = await TransactionService.fetchTransactionType();
      setTransactions(response?.data || []);
    } catch (error) {}
  };

  const handleTableChange = (data) => {
    let current_page = { page: data.current, pageSize: data.pageSize };

    let params = { ...searchParams, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleRange = (data) => {
    if (data && !data.length < 1) {
      let dateRange = `${data[0].format('YYYY-MM-DD')}..${data[1].format(
        'YYYY-MM-DD'
      )}`;

      let params = {
        ...searchParams,
        dateRange,
      };

      setSearchParams(params);
      setPage(start_page);
    } else {
      let params = {
        ...searchParams,
        dateRange: null,
      };
      setSearchParams(params);
      setPage(start_page);
    }
  };

  const handleTransaction = (transactionType) => {
    let params = {
      ...searchParams,
      ...start_page,
      transactionType: transactionType || null,
    };

    setSearchParams(params);
    setPage(start_page);
  };

  const handleSearch = debounce((value) => {
    let params = {
      ...searchParams,
      ...start_page,
      search: value || null,
    };

    setSearchParams(params);
    setPage(start_page);
  }, 500);

  const printTrialBalance = () => {
    setIsPrinting(true);
    let params = {
      reportName: 'Trial_Balance',
      format: 'PDF',
      asAt: '2024-12-31',
      financialYearId: 1,
    };
    reportsService
      .fetchReports(params)
      .then((resp) => {
        let report = resp.data;

        console.log('Report response:\n', report);
        let reportName = 'Trial Balance.pdf';

        fileDownload(report, reportName);
        setIsPrinting(false);
      })
      .catch((err) => {
        setIsPrinting(false);
      });
  };

  return (
    <div id='contents'>
      <Card
        title='Journal Entry'
        extra={[
          <Space size={'large'} key={'1'}>
            {validatePermission('create_journal') && (
              <Button
                type='primary'
                onClick={() => {
                  navigate('/accounting/journals/new');
                }}
              >
                New Journal
              </Button>
            )}
            {validatePermission('print_trial_balance') && (
              <Button
                icon={<FiPrinter />}
                type='primary'
                danger
                className='ml-2'
                loading={isPrinting}
                onClick={() => printTrialBalance()}
              >
                Print Trial Balance
              </Button>
            )}
          </Space>,
        ]}
      >
        <Row type='flex' gutter={[16, 16]}>
          <Col span={6}>
            <Input
              allowClear
              size={'small'}
              suffix={<SearchOutlined />}
              placeholder={'Search...'}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={6}>
            {/* <AccountsSearch size='small' onChange={handleAccount} /> */}
          </Col>
          <Col span={6}>
            <Select
              size='small'
              style={{ width: '100%' }}
              onChange={handleTransaction}
              placeholder={'Select a transaction type'}
            >
              <Option key='empty' value={''} style={{ color: '#bfbfbf' }}>
                Select a transaction type
              </Option>
              {transactions.map((trans) => (
                <Option key={trans} value={trans}>
                  {trans}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              size='small'
              style={{ marginLeft: 10, marginRight: 10 }}
              onChange={handleRange}
            />
          </Col>
        </Row>

        <Row gutter={[12, 15]} className='mt-3'>
          <Col
            lg={journalsFound ? 11 : 24}
            md={journalsFound ? 24 : 24}
            sm={24}
          >
            <Table
              loading={isLoading}
              size='small'
              bordered
              dataSource={journals}
              onChange={handleTableChange}
              columns={columns}
              onRow={(row) => {
                return {
                  onClick: (event) => {
                    setCurrentJournalEntryId(row?.id || null);
                  },
                };
              }}
              rowKey={(record) => record.id}
              pagination={{
                current: page?.page,
                pageSize: page?.pageSize,
                total: total_elements,
              }}
            />
          </Col>
          <Col lg={13} md={24} sm={24}>
            {currentJournalEntryId ? (
              <div className='animated lightSpeedIn infinite'>
                <JournalInfo id={currentJournalEntryId} />
              </div>
            ) : journalsFound ? (
              <Row gutter={[16, 18]}>
                <Row gutter={[16, 18]}>
                  <Col span={10}>
                    <JournalInfoSkeleton style={{ width: '100%' }} />
                  </Col>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <JournalInfoSkeleton />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <JournalInfoSkeleton />
                  </Col>
                </Row>
              </Row>
            ) : null}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Journals;
