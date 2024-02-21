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
  Select,
  Dropdown,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { memberService, reportsService } from '../../../_services';
import { memberColumns, groupMemberColumns } from './columns';
import { BiSolidUserDetail } from 'react-icons/bi';
import { GoSearch } from 'react-icons/go';
import { debounce } from 'lodash';
import { AiOutlineDown } from 'react-icons/ai';
import { FaPrint } from 'react-icons/fa';
import { fileDownload } from '../../../_helpers/globalVariables';

const MemberView = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
    memberType: state
      ? state?.memberType ?? 'INDIVIDUAL'
      : 'INDIVIDUAL' ?? 'INDIVIDUAL',
  });
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentPrintBtnIndex, setCurrentPrintBtnIndex] = useState(null);

  const columns =
    searchParams.memberType === 'INDIVIDUAL'
      ? [
          ...memberColumns.filter((col) => col.dataIndex !== 'remarks'),
          {
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            title: <span className='table-title'>Actions</span>,
            width: 100,
            fixed: 'right',
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
        ]
      : [...groupMemberColumns];

  useEffect(() => {
    getMembersDetail(searchParams);
  }, [searchParams]);

  const getMembersDetail = (params) => {
    setLoading(true);
    setData([]);
    memberService
      .fetchMembers(params)
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

  const handleNavigateToCreateNewMember = () => {
    navigate('/new-member');
  };

  const handleNavigateToMemberDetails = (data) => {
    const params = { idNumber: data?.idNumber };

    navigate('/member-details', {
      state: { record: data, memberType: searchParams?.memberType },
    });
  };

  const handleMemberTypeSearch = (e) => {
    setSearchParams((prev) => ({ ...prev, memberType: e }));
  };

  const handleMenuClick = (key, data, index) => {
    switch (key) {
      case 'VIEW_MORE':
        handleNavigateToMemberDetails(data);

      case 'PRINT_STATEMENT':
        printMemberStatement(data, index);
        break;
      default:
        break;
    }
  };

  const dropDownItems = [
    {
      key: 'VIEW_MORE',
      label: (
        <>
          <BiSolidUserDetail
            style={{ color: '#87d068', marginTop: '-2px', fontSize: '18px' }}
          />{' '}
          View more
        </>
      ),
    },
    {
      key: 'PRINT_STATEMENT',
      label: (
        <>
          <FaPrint style={{ color: 'red', marginTop: '-5px' }} /> Print
          statement
        </>
      ),
    },
  ];

  const printMemberStatement = (member, index) => {
    let params = {
      reportName: 'MemberStatement',
      format: 'PDF',
      memberId: member.id,
      ReportTitle: `Member Statement`,
    };
    setIsPrinting(true);
    setCurrentPrintBtnIndex(index);
    reportsService
      .fetchReports(params)
      .then((resp) => {
        let report = resp.data;

        console.log('Report response:\n', report);
        let reportName = `${member?.fullName} - Member Statement.pdf`;

        fileDownload(report, reportName);
        setIsPrinting(false);
        setCurrentPrintBtnIndex(null);
      })
      .catch((err) => {
        setIsPrinting(false);
        setCurrentPrintBtnIndex(null);
      });
  };

  return (
    <Card
      type='inner'
      title='Members Register'
      id='content'
      size='small'
      extra={
        <>
          <Button
            type='primary'
            size='small'
            onClick={() => handleNavigateToCreateNewMember()}
          >
            New Member(s)
          </Button>
        </>
      }
    >
      <Row gutter={[10, 14]}>
        <Col span={24} className='m-0 p-0'>
          <Row gutter={[8, 10]}>
            <Col span={24}>
              <Row gutter={[10, 14]} className='d-flex justify-content-between'>
                <Col xl={6} lg={8} md={10} sm={12} xs={24}>
                  <Input
                    prefix={<GoSearch />}
                    allowClear
                    placeholder='Search...'
                    style={{ width: '100%' }}
                    onChange={(e) => handleGeneralSearch(e.target.value)}
                  />
                </Col>
                <Col xl={5} lg={6} md={8} sm={12} xs={24}>
                  <Select
                    defaultValue={searchParams.memberType}
                    value={searchParams.memberType}
                    style={{ width: '100%' }}
                    placeholder='Search...'
                    onChange={(e) => handleMemberTypeSearch(e)}
                    options={[
                      { value: 'INDIVIDUAL', label: 'Individual' },
                      { value: 'GROUP', label: 'Group' },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24} className='mb-2'>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record?.id ?? Math.random()}
            size='small'
            onChange={handleTableChange}
            loading={isLoading}
            pagination={{
              total: totalElements,
              current: page.pageNo + 1,
              pageSize: page.pageSize,
            }}
            scroll={{
              y: 1170,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <Card hoverable title='Group Members' type='inner'>
                  <Table
                    columns={[
                      ...memberColumns.filter(
                        (col) => col.dataIndex !== 'memberType'
                      ),
                      {
                        title: null,
                        dataIndex: 'action',
                        key: 'action',
                        width: '4%',
                        render: (text, row) => (
                          <div className='d-flex justify-content-start'>
                            <Space size={[0, 8]} wrap>
                              <Tag
                                color='#2db7f5'
                                title='View more'
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  handleNavigateToMemberDetails(row)
                                }
                              >
                                <BiSolidUserDetail
                                  style={{
                                    fontSize: '15px',
                                    marginTop: '-2px',
                                  }}
                                />
                              </Tag>
                            </Space>
                          </div>
                        ),
                      },
                    ]}
                    dataSource={record.groupData?.groupMembersData ?? []}
                    rowKey={(record) => record?.id ?? Math.random()}
                    size='small'
                  />
                </Card>
              ),
              rowExpandable: (record) => record.memberType !== 'INDIVIDUAL',
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

export default MemberView;
