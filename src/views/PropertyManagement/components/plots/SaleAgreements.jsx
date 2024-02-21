import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Space,
  Dropdown,
  DatePicker,
  Select,
  Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEditNote } from 'react-icons/md';
import { debounce } from 'lodash';
import { AiOutlineDown } from 'react-icons/ai';
import { purchaseAgreementColumns } from './columns';
import { purchaseAgreementService } from '../../../../_services/purchase_agreement.service';
import { IoEyeOutline } from 'react-icons/io5';
import { MarketerSearch } from '../../../../_components/MarketerSearch';
import { CSVLink } from 'react-csv';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { ImEqualizer } from 'react-icons/im';
import { SearchOutlined } from '@ant-design/icons';
import { CiCircleRemove } from 'react-icons/ci';
import { FaPrint } from 'react-icons/fa';
import {
  blockService,
  phaseService,
  reportsService,
} from '../../../../_services';
import { Box, TextField } from '@mui/material';
import { fileDownload } from '../../../../_helpers/globalVariables';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
let agreementNumber = null;

const SaleAgreements = (props) => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [currentActiveSelection, setCurrentActiveSelection] =
    useState('generalSearch');
  const [isAdvancedSearchEngaged, setIsAdvancedSearchEngaged] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [phases, setPhases] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentPrintBtnIndex, setCurrentPrintBtnIndex] = useState(null);

  const columns = [
    ...purchaseAgreementColumns,
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      width: 100,
      fixed: 'right',
      align: 'center',

      render: (_, row, index) => (
        <Dropdown
          menu={{
            items: dropDownItems,
            onClick: (e) => handleMenuClick(e.key, row, index),
          }}
          disabled={currentPrintBtnIndex !== index && isPrinting}
        >
          <Button
            size='small'
            loading={currentPrintBtnIndex === index && isPrinting}
          >
            <Space>
              Actions
              <AiOutlineDown />
            </Space>
          </Button>
        </Dropdown>
      ),
    },
  ];

  const handleMenuClick = (key, data, index) => {
    switch (key) {
      case 'EDIT':
        handleNavigateToUpdatePlotDetails(data);
        break;
      case 'PRINT':
        printSalesAgreement(data, index);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getSaleAgreements(searchParams);
    setIsAdvancedSearchEngaged(isAdvanceSearching());
  }, [searchParams]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = (params) => {
    setBlocks([]);
    setPhases([]);
    blockService.fetchBlocks(params).then((resp) => {
      let content = resp.data?.body || [];
      setBlocks(content);
    });
  };
  const isAdvanceSearching = () => {
    if (agreementNumber) {
      return true;
    } else {
      return false;
    }
  };

  const getSaleAgreements = (params) => {
    setLoading(true);
    setData([]);
    purchaseAgreementService
      .fetchPurchaseAgreement(params)
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

  const handleNavigateToCreateNewAgreement = () => {
    navigate('/sale-agreements/new', { state: { isNewAgreement: true } });
  };

  const handleNavigateToMemberStatement = (data) => {
    navigate('/sale-agreements/member-statement', {
      state: { data },
    });
  };

  const handleNavigateToUpdatePlotDetails = (data) => {
    navigate('/sale-agreements/update', {
      state: { isNewAgreement: false, record: data },
    });
  };

  const dropDownItems = [
    {
      key: 'PRINT',
      label: (
        <>
          <FaPrint style={{ color: 'red', marginTop: '-5px' }} /> Print
          statement
        </>
      ),
    },

    {
      key: 'EDIT',
      label: (
        <>
          <MdOutlineEditNote
            style={{ color: '#2db7f5', marginTop: '-4px', fontSize: '19px' }}
          />{' '}
          Edit
        </>
      ),
    },
  ];

  const printSalesAgreement = (statement, index) => {
    let params = {
      reportName: 'SalesAgreement',
      format: 'PDF',
      agreementId: statement.id,
      ReportTitle: `Sales agreement`,
    };

    setIsPrinting(true);
    setCurrentPrintBtnIndex(index);
    reportsService
      .fetchReports(params)
      .then((resp) => {
        let report = resp.data;

        console.log('Report response:\n', report);
        let reportName = `${statement?.agreementNumber} - Sales agreement.pdf`;

        fileDownload(report, reportName);
        setIsPrinting(false);
        setCurrentPrintBtnIndex(null);
      })
      .catch((err) => {
        setIsPrinting(false);
        setCurrentPrintBtnIndex(null);
      });
  };

  const handleRange = (data) => {
    if (data && !data.length < 1) {
      let date = `${data[0].format(dateFormat)}..${data[1].format(dateFormat)}`;

      let params = {
        ...searchParams,
        agreementDate: date,
      };
      setSearchParams(params);
    } else {
      let params = {
        ...searchParams,
        agreementDate: null,
      };
      setSearchParams(params);
    }
  };

  const selectMarketer = (data) => {
    if (data) {
      setSearchParams((prev) => ({ ...prev, saleAgreementOwner: data.id }));
    } else {
      setSearchParams((prev) => ({ ...prev, saleAgreementOwner: null }));
    }
  };

  const handlePurchaseTypeChange = (e) => {
    setSearchParams((prev) => ({ ...prev, purchaseType: e }));
  };

  const handleAdvancedChanges = (val, type) => {
    switch (type) {
      case ACTIONS.AGREEMENT_NUMBER:
        if (val) {
          agreementNumber = val;
        } else {
          agreementNumber = null;
        }
        break;

      default:
        break;
    }
  };
  const handleClearFilters = () => {
    agreementNumber = null;

    let advancedParams = {
      pageNo: 0,
      plotNo: null,
      agreementNumber: null,
    };
    setIsAdvancedSearchEngaged(false);
    setSearchParams((prev) => ({ ...prev, ...advancedParams }));
  };

  const confirm = () => {
    modal.confirm({
      title: 'Advanced Search',
      width: '550px',
      icon: <SearchOutlined />,
      content: (
        <Row gutter={[8, 10]}>
          <Col span={24}>
            <Box
              component='form'
              sx={{
                '& > :not(style)': { m: 1, width: '50ch' },
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                label='Agreement No.'
                variant='standard'
                defaultValue={agreementNumber}
                onChange={(e) => {
                  handleAdvancedChanges(
                    e.target.value,
                    ACTIONS.AGREEMENT_NUMBER
                  );
                }}
              />
            </Box>
          </Col>
        </Row>
      ),
      okText: 'Search',
      onOk: () => {
        handleAdvancedSearch();
      },
      cancelText: 'Clear Filters',
      onCancel: () => handleClearFilters(),
    });
  };

  const handleClearAdvancedSearch = () => {
    agreementNumber = null;
    setSearchParams((prev) => ({
      ...prev,
      ...defaultPage,
      agreementNumber,
    }));
  };

  const handlePhaseSearch = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, phaseId: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, phaseId: null }));
    }
  };

  const handleBlockSearch = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, blockId: val }));
      fetchPhases({ blockId: val });
    } else {
      setSearchParams((prev) => ({ ...prev, blockId: null }));
    }
  };
  const fetchPhases = (params) => {
    phaseService.fetchPhases(params).then((resp) => {
      let content = resp.data.body?.content || [];
      setPhases(content);
    });
  };
  const handleAdvancedSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageNo: 0,
      agreementNumber,
    }));
  };

  return (
    <div id='content'>
      {contextHolder}
      <Card
        type='inner'
        title='Sale Agreements'
        extra={
          <>
            <Button
              type='primary'
              size='small'
              onClick={() => handleNavigateToCreateNewAgreement()}
            >
              New Sale Agreement
            </Button>
          </>
        }
      >
        <div
          style={{
            backgroundColor: '#f3f3f3',
            borderRadius: '10px',
            padding: '8px',
          }}
        >
          <Row gutter={[5, 12]} className='d-flex justify-content-end'>
            <Col xl={1} lg={1} md={2} sm={3} xs={4}>
              <ImEqualizer
                title='Advanced search'
                onClick={confirm}
                style={{
                  cursor: 'pointer',
                  color: isAdvancedSearchEngaged ? '#0079ff' : '#6f6f7b',
                  marginTop: '8px',
                }}
              />
              {isAdvancedSearchEngaged && (
                <CiCircleRemove
                  style={{
                    marginTop: '8px',
                    color: 'red',
                    cursor: 'pointer',
                    marginLeft: '5px',
                    fontSize: '16px',
                  }}
                  title=' Clear advanced search'
                  onClick={() => handleClearAdvancedSearch()}
                />
              )}
            </Col>
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
            <Col xl={4} lg={4} md={12} sm={24} xs={24}>
              <Select
                showSearch
                allowClear
                placeholder='Select phase'
                optionFilterProp='children'
                onChange={handlePhaseSearch}
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  (option?.searchLabel ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={phases.map((phase) => {
                  return {
                    value: phase.id,
                    searchLabel: phase?.phaseName,
                    label: (
                      <>
                        <>
                          {(phase?.phaseName &&
                            convertToLowerThenCapitalize(phase.phaseName)) ||
                            ''}
                        </>
                      </>
                    ),
                  };
                })}
              />
            </Col>

            <Col xxl={3} xl={3} lg={3} md={12} sm={12} xs={24}>
              <Select
                allowClear
                placeholder='Purchase type'
                onChange={(e) => handlePurchaseTypeChange(e)}
                style={{ width: '100%' }}
              >
                <Option value={null} style={{ color: 'rgba(0, 0, 0 ,.5' }}>
                  - Select purchase type -
                </Option>
                <Option value={'Cash'}>Cash</Option>
                <Option value={'Installment'}>Installment</Option>
              </Select>
            </Col>
            <Col xxl={5} xl={5} lg={5} md={12} sm={12} xs={24}>
              <MarketerSearch marketer={selectMarketer} />
            </Col>
            <Col xxl={5} xl={5} lg={5} md={12} sm={12} xs={24}>
              <RangePicker
                placeholder={['Start Date', 'End Date']}
                onChange={handleRange}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </div>

        <Row className='mt-2' gutter={[10, 14]}>
          <Col span={24}>
            <Table
              bordered
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
                x: 2350,
              }}
              footer={() => (
                <CSVLink
                  filename={`Sale Agreements.csv`}
                  data={data.map((item) => {
                    const { propertyBasicData, memberBasicData, ...rest } =
                      item;
                    return rest;
                  })}
                >
                  <RiFileExcel2Fill color='#117d42' />
                  Export CSV
                </CSVLink>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
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
const ACTIONS = Object.freeze({
  AGREEMENT_NUMBER: 'AGREEMENT_NUMBER',
});

export default SaleAgreements;
