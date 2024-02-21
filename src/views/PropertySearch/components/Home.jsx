import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Form,
  Button,
} from 'antd';
import { propertySearchColumns, fileLocationsColumns } from './columns';
import { ImEqualizer } from 'react-icons/im';
import { GoSearch } from 'react-icons/go';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { CiCircleRemove } from 'react-icons/ci';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  plotService,
  blockService,
  phaseService,
  filesService,
} from '../../../_services';
import { MdOutlineEditNote, MdOutlineDoNotDisturbAlt } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Option } = Select;

let plotNo = null;
let idNumber = null;
let certNo = null;
let titleNumber = null;

const Home = () => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 9 };
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isAdvancedSearchEngaged, setIsAdvancedSearchEngaged] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [phases, setPhases] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [currentActiveSelection, setCurrentActiveSelection] =
    useState('generalSearch');

  useEffect(() => {
    getPlotDetails(searchParams);
    setIsAdvancedSearchEngaged(isAdvanceSearching());
  }, [searchParams]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const columns = [
    ...propertySearchColumns,
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      width: 95,
      fixed: 'right',
      render: (text, row) => (
        <div className='d-flex justify-content-start'>
          <Space size={[0, 2]} wrap>
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
              title='View file location(s)'
              style={{ cursor: 'pointer' }}
              onClick={() => fetchLocations(row)}
            >
              <AiOutlineEye style={{ fontSize: '15px', marginTop: '-2px' }} />
            </Tag>
          </Space>
        </div>
      ),
    },
  ];

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

  const fetchBlocks = (params) => {
    setBlocks([]);
    setPhases([]);
    blockService.fetchBlocks(params).then((resp) => {
      let content = resp.data?.body || [];
      setBlocks(content);
    });
  };

  const fetchPhases = (params) => {
    phaseService.fetchPhases(params).then((resp) => {
      let content = resp.data.body?.content || [];
      setPhases(content);
    });
  };

  const handleTableChange = (data) => {
    let current_page = { pageNo: data?.current - 1, pageSize: data?.pageSize };
    let params = {
      ...searchParams,
      ...current_page,
    };
    setPage(current_page);
    setSearchParams(params);
  };

  const handleGeneralSearch = debounce((val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, term: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, term: null }));
    }
  }, 800);

  const handleBlockSearch = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, blockId: val }));
      fetchPhases({ blockId: val });
    } else {
      setSearchParams((prev) => ({ ...prev, blockId: null }));
    }
  };

  const handlePhaseSearch = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, phaseId: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, phaseId: null }));
    }
  };

  const isAdvanceSearching = () => {
    if (idNumber || plotNo || certNo || titleNumber) {
      return true;
    } else {
      return false;
    }
  };

  const handleAdvancedChanges = debounce((val, type) => {
    switch (type) {
      case ACTIONS.ID_NUMBER:
        if (val) {
          idNumber = val;
        } else {
          idNumber = null;
        }
        break;

      case ACTIONS.BALLOT_NUMBER:
        if (val) {
          plotNo = val;
        } else {
          plotNo = null;
        }
        break;

      case ACTIONS.CERTIFICATE_NUMBER:
        if (val) {
          certNo = val;
        } else {
          certNo = null;
        }
        break;

      case ACTIONS.TITLE_DEED:
        if (val) {
          titleNumber = val;
        } else {
          titleNumber = null;
        }
        break;
      default:
        break;
    }
  }, 0);

  const handleClearFilters = () => {
    plotNo = null;
    idNumber = null;
    certNo = null;
    titleNumber = null;

    let advancedParams = {
      pageNo: 0,
      plotNo: null,
      idNumber: null,
      certNo: null,
      titleNumber: null,
    };
    setIsAdvancedSearchEngaged(false);
    setSearchParams((prev) => ({ ...prev, ...advancedParams }));
  };

  const handleNavigateToUpdatePlotDetails = (data) => {
    navigate('/edit-plot', { state: { isNewPlot: false, record: data } });
  };

  const handleAdvancedSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageNo: 0,
      plotNo,
      idNumber,
      certNo,
      titleNumber,
    }));
  };

  const fetchLocations = async (values) => {
    if (!values) {
      return toast.warning('No search criteria availed');
    }

    setFetchingLocations(true);

    let params = {
      certNo: values?.certificateNumber,
      plotNo: values?.plotNumber,
    };

    try {
      setFetchingLocations(false);
      let response = await filesService.fetchFiles(params);
      let content = response.data?.body || [];
      showFileLocations(content, params.certNo, params.plotNo);
    } catch (error) {
      setFetchingLocations(false);
    }
  };

  const showFileLocations = (data, certNoDefaultValue, plotNoDefaultValue) => {
    const locationsInfoModal = modal.info({
      title: (
        <span style={{ fontSize: '10px', color: '#23c773' }}>
          File locations
        </span>
      ),
      width: '550px',
      icon: null,
      content: (
        <>
          <Row gutter={[10, 14]} className='mb-2'>
            <Row
              gutter={[12, 12]}
              style={{ background: 'whitesmoke', borderRadius: '5px' }}
            >
              <Col span={12}>
                <Form.Item colon={false} label='Cert No.'>
                  <Input
                    prefix={<GoSearch style={{ color: '#2cff93' }} />}
                    defaultValue={certNoDefaultValue}
                    onChange={(e) =>
                      handleSearchByCertNo(locationsInfoModal, e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item colon={false} label='Plot No.'>
                  <Input
                    prefix={<GoSearch style={{ color: '#2cff93' }} />}
                    defaultValue={plotNoDefaultValue}
                    onChange={(e) => {
                      // handleSearchByPlotNo(locationsInfoModal, e.target.value); //TODO: Come later when backend is ready
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Table
                columns={fileLocationsColumns}
                dataSource={data}
                rowKey={(record) => record.id}
                size='small'
                loading={fetchingLocations}
                pagination={false}
              />
            </Col>
          </Row>
        </>
      ),
      okText: 'Close',
      okButtonProps: {
        ghost: true,
        size: 'small',
      },
    });
  };

  const handleSearchByCertNo = debounce(async (modal, certNo) => {
    setFetchingLocations(true);
    let params = {
      certNo,
    };

    try {
      let response = await filesService.fetchFiles(params);
      let content = response.data?.body || [];
      setFetchingLocations(false);
      updateLocationsModal(modal, content);
    } catch (error) {
      setFetchingLocations(false);
    }
  }, 800);

  const handleSearchByPlotNo = async (modal, plotNo) => {
    setFetchingLocations(true);
    let params = {
      plotNo,
    };

    try {
      let response = await filesService.fetchFiles(params);
      let content = response.data?.body || [];
      setFetchingLocations(false);
      updateLocationsModal(modal, content);
    } catch (error) {
      setFetchingLocations(false);
    }
  };

  const updateLocationsModal = (modal, data) => {
    modal.update({
      content: (
        <>
          <Row gutter={[10, 14]} className='mb-2'>
            <Row
              gutter={[12, 12]}
              style={{ background: 'whitesmoke', borderRadius: '5px' }}
            >
              <Col span={12}>
                <Form.Item colon={false} label='Cert No.'>
                  <Input
                    prefix={<GoSearch style={{ color: '#2cff93' }} />}
                    onChange={(e) =>
                      handleSearchByCertNo(modal, e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item colon={false} label='Plot No.'>
                  <Input
                    prefix={<GoSearch style={{ color: '#2cff93' }} />}
                    onChange={(e) => {
                      // handleSearchByPlotNo(modal, e.target.value); //TODO: Come later when backend is ready
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Table
                columns={fileLocationsColumns}
                dataSource={data}
                rowKey={(record) => record.id}
                size='small'
                loading={fetchingLocations}
                pagination={false}
              />
            </Col>
          </Row>
        </>
      ),
    });
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
                label='ID Number'
                variant='standard'
                defaultValue={idNumber}
                onChange={(e) => {
                  handleAdvancedChanges(e.target.value, ACTIONS.ID_NUMBER);
                }}
              />
              <TextField
                label='Plot No.'
                variant='standard'
                defaultValue={plotNo}
                onChange={(e) => {
                  handleAdvancedChanges(e.target.value, ACTIONS.BALLOT_NUMBER);
                }}
              />
              <TextField
                label='Certificate No.'
                variant='standard'
                defaultValue={certNo}
                onChange={(e) => {
                  handleAdvancedChanges(
                    e.target.value,
                    ACTIONS.CERTIFICATE_NUMBER
                  );
                }}
              />

              <TextField
                label='Title Deed'
                defaultValue={titleNumber}
                variant='standard'
                onChange={(e) => {
                  handleAdvancedChanges(e.target.value, ACTIONS.TITLE_DEED);
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

  const handleClearAdvancedSearch = () => {
    plotNo = null;
    idNumber = null;
    certNo = null;
    titleNumber = null;

    setSearchParams((prev) => ({
      ...prev,
      ...defaultPage,
      plotNo,
      idNumber,
      certNo,
      titleNumber,
    }));
  };
  const handleTitleStatus = (e) => {
    setSearchParams((prev) => ({ ...prev, isTitlePresent: e }));
  };

  const handleAllocatedStatus = (e) => {
    setSearchParams((prev) => ({ ...prev, allocated: e }));
  };

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
    <>
      {contextHolder}
      <Card title='Property Search' type='inner'>
        <Row gutter={[10, 9]}>
          <Col span={24}>
            <Card style={{ backgroundColor: '#f3f3f3' }}>
              <Row gutter={[8, 10]}>
                <Col span={1} className='d-flex justify-content-start'>
                  <Col
                    span={24}
                    className='m-0 p-0 d-flex justify-content-start'
                  >
                    <Row gutter={[8]}>
                      <Col span={24}>
                        <Space>
                          <ImEqualizer
                            title='Advanced search'
                            onClick={confirm}
                            style={{
                              cursor: 'pointer',
                              color: isAdvancedSearchEngaged
                                ? '#0079ff'
                                : '#6f6f7b',
                              marginTop: '8px',
                            }}
                          />
                          {isAdvancedSearchEngaged && (
                            <CiCircleRemove
                              style={{
                                marginTop: '8px',
                                color: 'red',
                                cursor: 'pointer',
                              }}
                              title=' Clear advanced search'
                              onClick={() => handleClearAdvancedSearch()}
                            />
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                </Col>
                <Col span={23} className='d-flex justify-content-start'>
                  <Col span={24} className='m-0 p-0'>
                    <Row gutter={[8, 10]}>
                      <Col xl={5} lg={5} md={12} sm={24} xs={24}>
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
                                    convertToLowerThenCapitalize(
                                      block.blockName
                                    )) ||
                                    ''}
                                  {` - `}
                                  {(block?.county &&
                                    convertToLowerThenCapitalize(
                                      block.county
                                    )) ||
                                    ''}
                                  {` - `}
                                  {(block?.subCounty &&
                                    convertToLowerThenCapitalize(
                                      block.subCounty
                                    )) ||
                                    ''}
                                </>
                              ),
                            };
                          })}
                        />
                      </Col>
                      <Col xl={5} lg={5} md={12} sm={24} xs={24}>
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
                                      convertToLowerThenCapitalize(
                                        phase.phaseName
                                      )) ||
                                      ''}
                                  </>
                                </>
                              ),
                            };
                          })}
                        />
                      </Col>
                      <Col xl={3} lg={3} md={12} sm={24} xs={24}>
                        <Select
                          allowClear
                          placeholder='Select title no. status'
                          onChange={(e) => handleTitleStatus(e)}
                          style={{ width: '100%' }}
                          dropdownStyle={{ width: '200' }}
                          popupMatchSelectWidth={false}
                        >
                          <Option
                            value={''}
                            style={{ color: 'rgba(0, 0, 0 ,.5' }}
                          >
                            - Select status -
                          </Option>
                          <Option value={true}>Has title number</Option>
                          <Option value={false}>Has no title number</Option>
                        </Select>
                      </Col>
                      <Col xl={3} lg={3} md={12} sm={24} xs={24}>
                        <Select
                          allowClear
                          placeholder='Select allocation status'
                          onChange={(e) => handleAllocatedStatus(e)}
                          style={{ width: '100%' }}
                          dropdownStyle={{ width: '200' }}
                          popupMatchSelectWidth={false}
                        >
                          <Option
                            value={''}
                            style={{ color: 'rgba(0, 0, 0 ,.5' }}
                          >
                            - Select status -
                          </Option>
                          <Option value={true}>Allocated</Option>
                          <Option value={false}>Not allocated</Option>
                        </Select>
                      </Col>
                      <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                        <Input
                          addonBefore={selectBefore}
                          allowClear
                          onChange={(e) => handleSpecializedSearch(e)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Col>
              </Row>
            </Card>
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
                current: page?.pageNo + 1,
                pageSize: page?.pageSize,
              }}
              scroll={{
                x: 1150,
              }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

const ACTIONS = Object.freeze({
  ID_NUMBER: 'ID_NUMBER',
  BALLOT_NUMBER: 'BALLOT_NUMBER',
  CERTIFICATE_NUMBER: 'CERTIFICATE_NUMBER',
  BLOCK_ID: 'BLOCK_ID',
  TITLE_DEED: 'TITLE_DEED',
});

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

export default Home;
