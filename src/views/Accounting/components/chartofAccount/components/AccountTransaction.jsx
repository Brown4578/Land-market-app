import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Descriptions,
  Row,
  DatePicker,
  Tag,
  Statistic,
  Tooltip,
  Button,
  Space,
  Typography,
} from 'antd';
import { accountingService } from '../../../../../_services';
import { columns } from './accountColumn';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FiPrinter } from 'react-icons/fi';
import { CiMail } from 'react-icons/ci';
import { IoMdCopy, IoMdCheckmark } from 'react-icons/io';

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

const DateFormat = 'YYYY-MM-DD';
const startOfMonth = dayjs().startOf('month').format(DateFormat);
const endOfMonth = dayjs().endOf('month').format(DateFormat);
const ButtonGroup = Button.Group;
const defaultDateRange = `${startOfMonth}..${endOfMonth}`;

const AccountTransaction = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;
  const accountIdentifier = state && state.accountIdentifier;

  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const [accountEntries, setAccountEntries] = useState([]);
  const [params, setParams] = useState();
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({});
  const [defaultCurrency, setDefaultCurrency] = useState('KES');
  const [reportParam, setReportParam] = useState({
    range: defaultDateRange,
    reportName: 'Account_Transactions',
    identifier: accountIdentifier,
  });

  useEffect(() => {
    if (accountIdentifier) {
      doFetch(accountIdentifier, params);
    }
  }, [accountIdentifier, params]);

  const handleRange = (date, dateString) => {
    let dateRange = dateString.join('..');
    let newParams = { ...params, dateRange };
    setParams(newParams);
    setReportParam({ ...reportParam, range: dateRange });
  };

  const doFetch = (accountIdentifier, params) => {
    setLoading(true);
    accountingService.getAccount(accountIdentifier).then((res) => {
      setAccount(res.data);
    });
    accountingService
      .getAccountTransaction(accountIdentifier, params)
      .then((res) => {
        console.log(res);
        const pagination = {
          total: res.data.pageDetails.totalElements,
          pageSize: res.data.pageDetails.perPage,
        };
        setPagination(pagination);

        setAccountEntries(res.data.content);
        setDateRange(res.data.pageDetails.reportPeriod);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleTableChange = (page) => {
    const pager = { ...pagination };
    pager.current = page.current;
    setPagination(pager);
    let newParams = { ...params, page: page.current, pageSize: page.pageSize };
    setParams(newParams);
  };
  const currency = defaultCurrency ? defaultCurrency : '';

  const handleBackToList = () => {
    navigate(-1);
  };

  return (
    <div id='content'>
      <Card
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => handleBackToList()}
            />
            <span>Account Transactions:</span>
            {` `}
            <span
              style={{ fontWeight: 'bold', color: '#50abff', fontSize: '12px' }}
            >
              #{account.name}
            </span>
          </Space>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label={'Account Name'}>
            {account.name}
          </Descriptions.Item>
          <Descriptions.Item label={'Account Number'}>
            {account.identifier ? (
              <Paragraph
                copyable={{
                  icon: [
                    <IoMdCopy
                      key='copy-icon'
                      style={{ marginTop: '-3px', fontSize: 'inherit' }}
                    />,
                    <IoMdCheckmark
                      key='copied-icon'
                      style={{ marginTop: '-3px', fontSize: 'inherit' }}
                    />,
                  ],
                  tooltips: ['Copy account number', 'Copied'],
                }}
              >
                {account.identifier}
              </Paragraph>
            ) : (
              <Tag color='magenta'>Missing</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={'Account Type'}>
            {account.type}
          </Descriptions.Item>
          <Descriptions.Item label={'Ledger'}>
            {account.ledger !== null ? account.ledger : `-`}
          </Descriptions.Item>
          <Descriptions.Item label={'Status'}>
            {account.state === 'OPEN' ? (
              <Tag color='green'>Active</Tag>
            ) : (
              <Tag color='red'>In-active</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={!account.balance && 'Balance'}>
            {!account.balance ? (
              <Tag color='red'>Missing</Tag>
            ) : (
              <Statistic
                title={'Balance'}
                prefix={currency}
                value={account.balance}
              />
            )}
          </Descriptions.Item>

          {dateRange && (
            <Descriptions.Item label={'Report Period:'}>
              {dateRange}
            </Descriptions.Item>
          )}
        </Descriptions>
        <Row
          type='flex'
          justify='space-between'
          style={{ marginBottom: '10px' }}
        >
          <ButtonGroup key='1'>
            {/* <ReportDownloader format='PDF' params={reportParam
            <ReportDownloader format='CSV' params={reportParam */}
            <Tooltip title={'Print Document'}>
              <Button icon={<FiPrinter />} style={{ color: 'blue' }} />
            </Tooltip>
            <Tooltip title={'EMail Document'}>
              <Button icon={<CiMail />} style={{ color: 'orange' }} />
            </Tooltip>
          </ButtonGroup>

          <RangePicker
            placeholder={['Start Date', 'End Date']}
            onChange={handleRange}
            separator={'..'}
            defaultValue={[
              dayjs(startOfMonth, DateFormat),
              dayjs(endOfMonth, DateFormat),
            ]}
          />
        </Row>

        <Table
          loading={loading}
          bordered
          dataSource={accountEntries}
          columns={columns}
          onChange={handleTableChange}
          size='small'
          pagination={pagination}
          scroll={{ x: 1150 }}
          // rowKey={record => record.type + '-' + record.transaction_date}
          rowKey={(record) => record.id}
        />

        {/* </Skeleton> */}
      </Card>
    </div>
  );
};

export default AccountTransaction;
