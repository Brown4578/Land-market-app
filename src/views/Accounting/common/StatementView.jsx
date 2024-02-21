import React, { useEffect, useState } from 'react';
import { accountingService, reportsService } from '../../../_services';
import {
  Row,
  Col,
  Table,
  Button,
  Dropdown,
  Space,
  Select,
  Input,
  DatePicker,
} from 'antd';
import { memberStatementColumns, statementColumns } from './columns';
import { AiOutlineDown } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { RiRefund2Line } from 'react-icons/ri';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { debounce } from 'lodash';
import { MdOutlinePrint } from 'react-icons/md';
import { CSVLink } from 'react-csv';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { MemberSearch } from '../../../_components/MemberSearch';
import MemberStatementHeader from '../../MemberManagement/components/MemberStatementHeader';
import StyledDivWithLegend from '../../../_components/StyledDivWithLegend';
import { fileDownload } from '../../../_helpers/globalVariables';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const StatementView = ({
  agreementNo = null,
  showActions = true,
  fromMemberStatement = false,

  ...props
}) => {
  const defaultPage = { pageNo: 0, pageSize: 10 };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
  });
  const [member, setMember] = useState(null);
  const [paymentActivity, setPaymentActivity] = useState(null);

  const columns = fromMemberStatement
    ? [...memberStatementColumns]
    : !showActions
    ? [...statementColumns]
    : [
        ...statementColumns,
        {
          key: 'actions',
          dataIndex: 'actions',
          align: 'center',
          title: <span>Actions</span>,
          width: 100,
          fixed: 'right',
          render: (_, row) => (
            <Dropdown
              menu={{
                items: dropDownItems,
                onClick: (e) => handleMenuClick(e.key, row),
              }}
            >
              <Button size='small'>
                <Space>
                  Actions
                  <AiOutlineDown />
                </Space>
              </Button>
            </Dropdown>
          ),
        },
      ];

  useEffect(() => {
    if (fromMemberStatement) {
      return setIsLoading(false);
    } else if (props?.activityType || props?.salesAgreementId) {
      retrieveReceipts(
        searchParams,
        props.activityType,
        props?.salesAgreementId
      );
    }
  }, [props?.salesAgreementId, searchParams, props.activityType]);

  const retrieveReceipts = (params, activity, purchaseAgreementId) => {
    setIsLoading(true);
    accountingService
      .fetchReceipts({ activity, ...params, purchaseAgreementId })
      .then((resp) => {
        const respBody = resp.data.body;
        setReceipts(respBody?.content || []);

        setTotalElements(respBody.pagination.totalElements || 0);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleMenuClick = (key, data) => {
    switch (key) {
      case 'EDIT':
        navigate('/update-event', { state: { data } });
      default:
        break;
    }
  };

  const dropDownItems = [
    {
      key: 'PRINT',
      label: (
        <>
          <MdOutlinePrint style={{ color: '#2db7f5', marginTop: '-2px' }} />{' '}
          Print
        </>
      ),
    },
    {
      key: 'REVERSE_PAYMENT',
      label: (
        <>
          <HiOutlineReceiptRefund style={{ color: 'red', marginTop: '-2px' }} />{' '}
          Reverse
        </>
      ),
    },
  ];

  const selectMember = (data) => {
    setSearchParams((prev) => ({ ...prev, memberId: data?.id }));
  };

  const handleTableChange = (value) => {
    let current_page = { pageNo: value.current - 1, pageSize: 10 };
    let params = { ...searchParams, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleGeneralSearch = debounce((val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, term: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, term: null }));
    }
  }, 800);

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

  const titleHeader = (
    <Row gutter={[10, 12]}>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
        <MemberSearch member={selectMember} />
      </Col>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
        <Input
          allowClear
          placeholder='Search...'
          onChange={(e) => handleGeneralSearch(e.target.value)}
        />
      </Col>
      <Col
        xxl={12}
        xl={12}
        lg={12}
        md={8}
        sm={24}
        xs={24}
        className='d-flex justify-content-end'
      >
        <RangePicker
          placeholder={['Start Date', 'End Date']}
          onChange={handleRange}
          // showTime={{ format: 'h:mm a', use12Hours: true }}
          // format={'YYYY-MM-DD h:mm a'}
        />
      </Col>
    </Row>
  );

  const table = (
    <Table
      dataSource={receipts}
      columns={columns}
      title={() => (!fromMemberStatement ? titleHeader : undefined)}
      footer={() => (
        <CSVLink
          filename={`Members' Statements.csv`}
          data={receipts.map((item) => {
            const { id, plotId, purchaseAgreementId, memberId, ...rest } = item;
            return rest;
          })}
        >
          {' '}
          <RiFileExcel2Fill color='#117d42' />
          Export CSV
        </CSVLink>
      )}
      rowKey={(record) => record.id}
      scroll={{
        x: props.activityType === 'MemberReceipt' ? '1550px' : '1370px',
      }}
      size='small'
      loading={isLoading}
      onChange={handleTableChange}
      onClick={handleTableChange}
      pagination={{
        current: page.pageNo + 1,
        pageSize: page.pageSize,
        total: totalElements,
      }}
    />
  );
  const handleParamsChanged = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  const selectedMemberChange = (member) => {
    setMember(member);
    setSearchParams((prev) => ({ ...prev, memberId: member?.id }));
  };
  const handlePreview = () => {
    if (!member) {
      setTotalElements(0);
      setReceipts([]);
      return toast.warning('Please select a member to preview their statement');
    }
    retrieveReceipts(searchParams);
  };
  const clearStatements = () => {
    setTotalElements(0);
    setReceipts([]);
  };

  return (
    <>
      {fromMemberStatement && (
        <Row>
          <Col span={24}>
            <MemberStatementHeader
              paramChanged={handleParamsChanged}
              selectedMember={selectedMemberChange}
              handlePreview={handlePreview}
              clearStatements={clearStatements}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col span={24}>
          {!fromMemberStatement ? (
            table
          ) : (
            <StyledDivWithLegend header='Table'>{table}</StyledDivWithLegend>
          )}
        </Col>
      </Row>
    </>
  );
};

export default StatementView;
