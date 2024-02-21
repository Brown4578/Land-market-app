import {
  Button,
  Col,
  DatePicker,
  Row,
  Select,
  Input,
  Descriptions,
} from 'antd';
import React, { useEffect, useState } from 'react';
import StyledDivWithLegend from '../../../_components/StyledDivWithLegend';
import { FaEye } from 'react-icons/fa';
import { LuPrinter } from 'react-icons/lu';
import { MdOutlineMailOutline, MdOutlineTextsms } from 'react-icons/md';
import { AiOutlineClear } from 'react-icons/ai';
import { MemberSearch } from '../../../_components/MemberSearch';
import { CapitalizeFirstLetterAndEachAfterWhitespace } from '../../../_helpers/utils/StringManipulator';
import { fileDownload } from '../../../_helpers/globalVariables';
import { toast } from 'react-toastify';
import { memberService, reportsService } from '../../../_services';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';

const MemberStatementHeader = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchMode, setSearchMode] = useState('idNumber');
  const [searchValue, setSearchValue] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [memberDetails, setMemberDetails] = useState({});
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue, setEndDateValue] = useState();
  const [printStatementLoading, setPrintStatementLoading] = useState(false);
  const disabledStartDate = (current) => {
    if (!current || !endDate) {
      return false;
    }
    return current.valueOf() > endDate.valueOf();
  };
  const disabledEndDate = (current) => {
    if (!current || !startDate) {
      return false;
    }
    return current.valueOf() <= startDate.valueOf();
  };

  useEffect(() => {
    props.paramChanged(searchParams);
  }, [searchParams]);

  const handleRangeChange = (date, type) => {
    let dateRange = null;

    if (type === 'start') {
      setStartDate(date);
      setStartDateValue(date);
      if (date && endDate) {
        dateRange = `${date.format(dateFormat)}..${endDate.format(dateFormat)}`;
        setSearchParams({ ...searchParams, dateRange });
      } else {
        setSearchParams({ ...searchParams, dateRange: null });
      }
    } else {
      setEndDateValue(date);
      setEndDate(date);
      if (date && startDate) {
        dateRange = `${startDate.format(dateFormat)}..${date.format(
          dateFormat
        )}`;
        setSearchParams({ ...searchParams, dateRange });
      } else {
        setSearchParams({ ...searchParams, dateRange: null });
      }
    }
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
    // setSearchParams({ ...searchParams, searchValue: value });
  };
  const handleSearchModeChange = (value) => {
    setSearchMode(value);
  };
  const onSearch = () => {
    if (!searchValue) {
      return toast.warning('Please input search value');
    }
    let data = {
      [searchMode]: searchValue,
    };
    getMember(data);
  };
  const selectMember = (data) => {
    preFillSearchValue(data);
    setMemberDetails(data);
    props.selectedMember(data);

    setSearchParams((prev) => ({ ...prev, memberId: data?.id }));
  };
  const preFillSearchValue = (data) => {
    if (searchMode === 'idNumber') {
      setSearchValue(data?.idNumber);
    } else {
      setSearchValue(data?.phoneNumber);
    }
  };
  const handleClearFilters = () => {
    setStartDateValue(null);
    setEndDateValue(null);
    setStartDate(null);
    setEndDate(null);
    setSearchParams((prev) => ({
      ...prev,
      dateRange: null,

      memberId: null,
    }));
    setStartDate(null);
    setEndDate(null);
    setSearchMode('idNumber');
    setSearchValue(null);

    setMemberDetails({});
    props.selectedMember(null);
    props.clearStatements();
  };
  const printMemberStatement = () => {
    if (!memberDetails?.id) {
      return toast.warning('Please select a member to print statement');
    }
    setPrintStatementLoading(true);
    let params = {
      reportName: 'MemberStatement',
      format: 'PDF',
      memberId: memberDetails.id,
      ReportTitle: `Member Statement`,
      startDate: startDateValue?.format(dateFormat),
      endDate: endDateValue?.format(dateFormat),
    };

    reportsService
      .fetchReports(params)
      .then((resp) => {
        setPrintStatementLoading(false);
        let report = resp.data;

        let reportName = `${memberDetails?.fullName} - Member Statement.pdf`;

        fileDownload(report, reportName);
        setIsPrinting(false);
      })
      .catch((err) => {
        setPrintStatementLoading(false);
      });
  };
  const getMember = async (params) => {
    setMemberDetails(null);

    try {
      let response = await memberService.fetchMembers(params);
      let data = response.data.body?.content || [];
      if (data.length === 1) {
        props.clearStatements();
        props.selectedMember(data[0]);

        setMemberDetails(data[0]);
      } else if (data.length > 1) {
        props.clearStatements();
        props.selectedMember(null);
        toast.warning('Multiple members found. Please refine your search');
      } else {
        toast.warning('No member found');
        props.clearStatements();
        props.selectedMember(null);
        setMemberDetails(null);
      }
    } catch (error) {
      props.clearStatements();
      props.selectedMember(null);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#E6E7EE',
        borderRadius: '10px',
        padding: '8px',
      }}
    >
      <Row>
        <Col lg={16} md={24}>
          <Row>
            <Col span={24}>
              <StyledDivWithLegend>
                <div className='row justify-content-center'>
                  <div className='col-auto'>
                    <Button
                      style={{ margin: '2px' }}
                      icon={<AiOutlineClear color='red' />}
                      onClick={() => handleClearFilters()}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className='col-auto'>
                    <Button
                      onClick={() => props.handlePreview()}
                      style={{ margin: '2px' }}
                      icon={<FaEye color='green' />}
                    >
                      Preview
                    </Button>
                  </div>
                  <div className='col-auto'>
                    <Button
                      onClick={() => printMemberStatement()}
                      style={{ margin: '2px' }}
                      icon={
                        printStatementLoading ? (
                          <LoadingOutlined color='green' />
                        ) : (
                          <LuPrinter color='blue' />
                        )
                      }
                    >
                      Print Statement
                    </Button>
                  </div>
                  <div className='col-auto'>
                    <Button
                      style={{ margin: '2px' }}
                      icon={<MdOutlineTextsms color='purple' />}
                    >
                      Send Sms
                    </Button>
                  </div>
                  <div className='col-auto'>
                    <Button
                      style={{ margin: '2px' }}
                      icon={<MdOutlineMailOutline color='orange' />}
                    >
                      Send Email
                    </Button>
                  </div>
                </div>
              </StyledDivWithLegend>
            </Col>
            <Col span={24}>
              <StyledDivWithLegend header='Filters'>
                <Row gutter={[24, 12]}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Row className='justify-content-between'>
                      <Col lg={6} md={8} sm={8} xs={24}>
                        <label>Start Date</label>
                      </Col>
                      <Col lg={18} md={16} sm={16} xs={24}>
                        <DatePicker
                          value={startDateValue}
                          format={'YYYY-MM-DD'}
                          disabledDate={disabledStartDate}
                          placeholder='Select start date'
                          style={{ width: '100%' }}
                          onChange={(date, dateString) =>
                            handleRangeChange(date, 'start')
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Row className='justify-content-between'>
                      <Col lg={6} md={6} sm={8} xs={24}>
                        <label>Search Mode</label>
                      </Col>
                      <Col lg={10} md={10} sm={8} xs={24}>
                        <Select
                          onChange={(value) => handleSearchModeChange(value)}
                          style={{ width: '100%', marginRight: '10px' }}
                          placeholder='Search mode'
                          value={searchMode}
                          defaultValue={searchMode}
                        >
                          <Option value={'idNumber'} key={'idNumber'}>
                            Id Number
                          </Option>
                          <Option value={'phoneNumber'} key={'phoneNumber'}>
                            Phone Number
                          </Option>
                        </Select>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={24}>
                        <MemberSearch
                          useButtonAsComponent
                          member={selectMember}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Row className='justify-content-between'>
                      <Col lg={6} md={6} sm={8} xs={24}>
                        <label>End Date</label>
                      </Col>
                      <Col lg={18} md={16} sm={16} xs={24}>
                        <DatePicker
                          value={endDateValue}
                          format={'YYYY-MM-DD'}
                          disabledDate={disabledEndDate}
                          placeholder='Select end date'
                          style={{ width: '100%' }}
                          onChange={(date, dateString) =>
                            handleRangeChange(date, 'end')
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Row className='justify-content-between'>
                      <Col lg={6} md={6} sm={8} xs={24}>
                        <label>Search Value</label>
                      </Col>
                      <Col lg={18} md={18} sm={16} xs={24}>
                        <Search
                          value={searchValue}
                          onChange={(e) =>
                            handleSearchValueChange(e.target.value)
                          }
                          style={{ width: '100%' }}
                          placeholder='Input search value'
                          onSearch={onSearch}
                          enterButton={
                            <Button
                              type='primary'
                              style={{
                                background: 'green',
                              }}
                            >
                              Ok
                            </Button>
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </StyledDivWithLegend>
            </Col>
          </Row>
        </Col>
        <Col lg={8} md={24} xs={24}>
          <StyledDivWithLegend header='Member Details'>
            <Row>
              <Col span={24}>
                <Descriptions
                  bordered
                  column={1}
                  layout='horizontal'
                  size='small'
                >
                  <Descriptions.Item label={'Name'}>
                    {CapitalizeFirstLetterAndEachAfterWhitespace(
                      memberDetails?.fullName
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Id Number'}>
                    {memberDetails?.idNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Email Address'}>
                    {memberDetails?.emailAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Phone Number'}>
                    {memberDetails?.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Member Type'}>
                    {memberDetails?.memberType}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </StyledDivWithLegend>
        </Col>
      </Row>
    </div>
  );
};

export default MemberStatementHeader;
