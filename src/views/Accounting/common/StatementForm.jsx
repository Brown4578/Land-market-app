import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  InputNumber,
  Form,
  Space,
  DatePicker,
  Tooltip,
  Modal,
} from 'antd';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MemberSearch } from '../../../_components/MemberSearch';
import { MarketerSearch } from '../../../_components/MarketerSearch';
import { SalesAgreementSearch } from '../../../_components/SalesAgreementSearch';
import {
  accountingService,
  codesService,
  phaseService,
  blockService,
} from '../../../_services';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const StatementForm = ({ cardTitle = '', type = null, ...props }) => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedMarketer, setSelectedMarketer] = useState(null);
  const [showMemberSearch, setShowMemberSearch] = useState(true);
  const [isNonMember, setIsNonMember] = useState(false);
  const [showMarketerSearch, setShowMarketerSearch] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedSalesAgreement, setSelectedSalesAgreement] = useState(null);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isFetchingBankAccounts, setIsFetchingBankAccounts] = useState(true);
  const [incomeAccounts, setIncomeAccounts] = useState([]);
  const [expensesAccounts, setExpensesAccounts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    fetchCodes();
    fetchBankAccountInterfaces();
    getIncomeAccounts();
    getExpenseAccounts();
    fetchBlocks();
  }, []);

  useEffect(() => {
    if (type === 'PAYMENT') {
      setIsNonMember(false);
    }
  }, [type]);

  const fetchBlocks = (params) => {
    setBlocks([]);
    blockService.fetchBlocks(params).then((resp) => {
      let content = resp.data?.body ?? [];
      setBlocks(content);
    });
  };

  const fetchPhases = (params) => {
    phaseService.fetchPhases(params).then((resp) => {
      let content = resp.data.body?.content || [];
      setPhases(content);
    });
  };

  const handleBlockChange = (val) => {
    if (val) {
      let params = { blockId: val };
      fetchPhases(params);
    } else {
      setPhases([]);
    }
  };
  const fetchBankAccountInterfaces = () => {
    setIsFetchingBankAccounts(true);
    accountingService
      .getAccountsInterfaceByName('Banks')
      .then((resp) => {
        const respData = resp.data?.body || null;

        if (respData) {
          fetchBanks(respData.sysCode);
        } else {
          toast.warning('Please setup account interface for bank');
        }
      })
      .catch((err) => {
        setIsFetchingBankAccounts(false);
      });
  };

  const fetchBanks = (parentAccountHierarchy) => {
    accountingService
      .getBanks(parentAccountHierarchy)
      .then((resp) => {
        const body = resp.data?.body || [];
        setBankAccounts(body);
        setIsFetchingBankAccounts(false);
      })
      .catch((err) => {
        setIsFetchingBankAccounts;
      });
  };

  const fetchCodes = () => {
    codesService
      .fetchCodes({
        type: 'PaymentMode',
      })
      .then((response) => {
        const content = response?.data || [];
        setPaymentModes(content);
      })
      .catch((error) => setPaymentModes([]));
  };

  const confirmSubmission = (values) => {
    modal.confirm({
      title: 'Confirm Submission',
      content: 'Are you sure you want to submit?',
      onOk: () => {
        if (type === 'RECEIPT') {
          doSaveReceipt(values);
        } else if (type === 'PAYMENT') {
          doSavePayment(values);
        }
      },
    });
  };

  const onFinish = (values) => {
    const newValues = {
      ...values,
      memberId:
        showMarketerSearch && type === 'PAYMENT'
          ? selectedMarketer?.id || null
          : (showMemberSearch && type === 'RECEIPT' && selectedMember?.id) ||
            null,
      plotId: selectedPlot?.id,
      purchaseAgreementId: selectedSalesAgreement?.id,
      transactionDate: values.transactionDate.format('YYYY-MM-DD'),
    };

    confirmSubmission(newValues);
  };

  const doSaveReceipt = (values) => {
    accountingService
      .createReceipt(values)
      .then(() => {
        toast.success('Payment received successfully');
        setIsSubmitBtnLoading(false);
        handleBackToList();
      })
      .catch((err) => {
        setIsSubmitBtnLoading(false);
      });
  };

  const doSavePayment = (values) => {
    accountingService
      .createPayment(values)
      .then(() => {
        toast.success('Payment submitted successfully');
        setIsSubmitBtnLoading(false);
        handleBackToList();
      })
      .catch((err) => {
        setIsSubmitBtnLoading(false);
      });
  };

  const getExpenseAccounts = () => {
    accountingService
      .fetchAccounts({ type: 'EXPENSE', state: 'OPEN, NOT_TRANSACTED' })
      .then((res) => {
        setExpensesAccounts(res.data.body?.content || []);
      });
  };

  const getIncomeAccounts = () => {
    accountingService
      .fetchAccounts({ type: 'REVENUE', state: 'OPEN, NOT_TRANSACTED' })
      .then((res) => {
        setIncomeAccounts(res.data.body?.content || []);
      });
  };

  const selectMember = (data) => {
    setSelectedMember(data);
    form.setFieldsValue({
      member: JSON.stringify(data),
    });
  };
  const selectMarketer = (data) => {
    if (data) {
      setSelectedMarketer(data);
      form.setFieldsValue({
        marketer: JSON.stringify(data),
      });
    } else {
      setSelectedMarketer(null);
      form.setFieldsValue({
        marketer: null,
      });
    }
  };

  const selectPlot = (data) => {
    setSelectedPlot(data);
  };

  const selectAgreement = (data) => {
    setSelectedSalesAgreement(data);
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  const handleActivityChange = (val) => {
    switch (val) {
      case 'MemberReceipt':
        setShowMemberSearch(true);
        setIsNonMember(false);
        break;
      case 'NonMemberReceipt':
        setShowMemberSearch(false);
        setIsNonMember(true);
        break;
      case 'NonMemberPayment':
        setShowMemberSearch(false);
        setShowMarketerSearch(false);
        setIsNonMember(true);
        break;
      case 'MarketerPayment':
        setShowMarketerSearch(true);
        setIsNonMember(false);
        break;
      case 'Refund':
        setShowMarketerSearch(false);
        setIsNonMember(false);
        break;
      default:
        break;
    }
  };

  return (
    <div id='content'>
      {contextHolder}
      <Card
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => handleBackToList()}
            />
            <span>{cardTitle}</span>
          </Space>
        }
      >
        <Form
          {...formItemLayout}
          layout='vertical'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={[10, 12]}>
            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Activity'
                name='activity'
                rules={[
                  {
                    required: true,
                    message: 'Activity is required!',
                  },
                ]}
              >
                <Select
                  placeholder='Select activity'
                  onChange={(e) => {
                    handleActivityChange(e);
                  }}
                  options={
                    type && type === 'RECEIPT' ? receiptOptions : paymentOptions
                  }
                />
              </Form.Item>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Transaction Date'
                name='transactionDate'
                rules={[
                  {
                    required: true,
                    message: 'Transaction date is required!',
                  },
                ]}
                initialValue={dayjs()}
              >
                <DatePicker
                  format={'YYYY-MM-DD'}
                  // disabled={}
                  placeholder='Select transaction date'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                name='paymentMode'
                label='Mode of Payment'
                rules={[
                  { required: true, message: 'Payment mode is required' },
                ]}
              >
                <Select
                  placeholder='Select payment mode'
                  options={paymentModes.map((mode) => {
                    return {
                      key: mode.id,
                      value: mode.codeValue,
                      label: mode.codeValue,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            {!isNonMember ? (
              <>
                <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Sales Agreement'
                    name='salesAgreement'
                    rules={[
                      {
                        required: false,
                        message: 'Sales agreement is required!',
                      },
                    ]}
                  >
                    <SalesAgreementSearch agreement={selectAgreement} />
                  </Form.Item>
                </Col>

                {!showMarketerSearch && (
                  <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='Member'
                      name='member'
                      rules={[
                        {
                          required: false,
                          message: 'Member is required!',
                        },
                      ]}
                    >
                      <MemberSearch member={selectMember} />
                    </Form.Item>
                  </Col>
                )}

                {/* <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Plot'
                    name='plot'
                    rules={[
                      {
                        required: false,
                        message: 'Plot is required!',
                      },
                    ]}
                  >
                    <PlotSearch plot={selectPlot} />
                  </Form.Item>
                </Col> */}
              </>
            ) : (
              <>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Block No.'
                    name='blockId'
                    rules={[
                      {
                        required: false,
                        message: 'Block no. is required!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder='Select a block'
                      optionFilterProp='children'
                      onChange={handleBlockChange}
                      filterOption={(input, option) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      dropdownStyle={{
                        minWidth: '340px',
                        width: '100%',
                      }}
                      options={blocks.map((block) => ({
                        value: block.id,
                        label: (
                          <Space>
                            {(block?.blockName &&
                              convertToLowerThenCapitalize(block.blockName)) ||
                              ''}
                            -
                            {(block?.county &&
                              convertToLowerThenCapitalize(block.county)) ||
                              ''}
                            -
                            {(block?.subCounty &&
                              convertToLowerThenCapitalize(block.subCounty)) ||
                              ''}
                          </Space>
                        ),
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Phase'
                    name='phaseId'
                    rules={[
                      {
                        required: false,
                        message: 'Phase is required!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder='Select a phase'
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={phases.map((phase) => ({
                        value: phase.id,
                        label: (
                          <Tooltip
                            title={
                              <>
                                {(phase?.phaseName &&
                                  convertToLowerThenCapitalize(
                                    phase.phaseName
                                  )) ||
                                  ''}
                                {' - '}
                                {phase?.blockName}
                              </>
                            }
                          >
                            <Space>
                              {(phase?.phaseName &&
                                convertToLowerThenCapitalize(
                                  phase.phaseName
                                )) ||
                                ''}
                              {' - '}
                              {phase?.blockName}
                            </Space>
                          </Tooltip>
                        ),
                      }))}
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            {showMarketerSearch && type === 'PAYMENT' && (
              <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Marketer'
                  name='marketer'
                  rules={[
                    {
                      required: true,
                      message: 'Marketer is required!',
                    },
                  ]}
                >
                  <MarketerSearch marketer={selectMarketer} />
                </Form.Item>
              </Col>
            )}
            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Amount'
                name='amount'
                rules={[
                  {
                    required: true,
                    message: 'Amount is required!',
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder='Enter amount'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            {!showMarketerSearch && (
              <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  name={`${'debitAccountId'}`}
                  label={`${'Debit'} Account`}
                  rules={[
                    {
                      required: true,
                      message: `${'Debit'} account is required`,
                    },
                  ]}
                >
                  <Select
                    placeholder='Select an account'
                    showSearch
                    loading={isFetchingBankAccounts}
                    filterOption={(input, option) =>
                      (option?.searchTxtAccName ?? '').includes(input)
                    }
                    options={(type === 'PAYMENT'
                      ? expensesAccounts
                      : bankAccounts
                    ).map((account) => {
                      return {
                        key: account.id,
                        value: account.id,
                        searchTxtAccName: account.name,
                        searchTxtAccNo: account.identifier,
                        label: (
                          <div className='d-flex justify-content-between'>
                            <span>{account.name}</span>
                            <span>{account.identifier}</span>
                          </div>
                        ),
                      };
                    })}
                  />
                </Form.Item>
              </Col>
            )}
            {(isNonMember || showMarketerSearch) && (
              <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  name={'creditAccountId'}
                  label={`Credit Account`}
                  rules={[
                    {
                      required: true,
                      message: `Credit account is required`,
                    },
                  ]}
                >
                  <Select
                    placeholder='Select an account'
                    showSearch
                    loading={isFetchingBankAccounts}
                    filterOption={(input, option) =>
                      (option?.searchTxtAccName ?? '').includes(input)
                    }
                    options={(type === 'PAYMENT'
                      ? bankAccounts
                      : incomeAccounts
                    ).map((account) => {
                      return {
                        key: account.id,
                        value: account.id,
                        searchTxtAccName: account.name,
                        searchTxtAccNo: account.identifier,
                        label: (
                          <div className='d-flex justify-content-between'>
                            <span>{account.name}</span>
                            <span>{account.identifier}</span>
                          </div>
                        ),
                      };
                    })}
                  />
                </Form.Item>
              </Col>
            )}

            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Transaction No.'
                name='transactionNumber'
                rules={[
                  {
                    required: true,
                    message: 'Transaction number is required!',
                  },
                ]}
              >
                <Input placeholder='Enter transaction number' />
              </Form.Item>
            </Col>

            <Col xxl={8} xl={16} lg={16} md={16} sm={12} xs={24}>
              <Form.Item
                label='Remarks'
                name='remarks'
                rules={[
                  {
                    required: true,
                    message: 'Remarks are required!',
                  },
                ]}
              >
                <Input.TextArea placeholder='Enter remarks' rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col span={24} className='d-flex justify-content-end'>
              <Button
                type='primary'
                htmlType='submit'
                loading={isSubmitBtnLoading}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const receiptOptions = [
  { value: 'MemberReceipt', label: 'Member Receipt' },
  { value: 'NonMemberReceipt', label: 'Non-member Receipt' },
];

const paymentOptions = [
  { value: 'Refund', label: 'Member Refund' },
  { value: 'MarketerPayment', label: 'Marketer Payment' },
  { value: 'NonMemberPayment', label: 'Non-member Payment' },
];

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

export default StatementForm;
