import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Form,
  Input,
  Select,
  Tag,
  DatePicker,
  InputNumber,
  Tooltip,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import {
  purchaseAgreementService,
  codesService,
  blockService,
  phaseService,
  accountingService,
} from '../../../../_services';
import { debounce } from 'lodash';
import moment from 'moment';
import { PlotSearch } from '../../../../_components/PlotSearch';
import { MemberSearch } from '../../../../_components/MemberSearch';
import { MarketerSearch } from '../../../../_components/MarketerSearch';
import dayjs from 'dayjs';
import { convertToLowerThenCapitalize } from '../../../../_helpers/utils/StringManipulator';

const { Option } = Select;

const NewPurchaseAgreement = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isNewAgreement } = state;
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState([]);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [purchaseType, setPurchaseType] = useState('Installment');
  const [selectedPlots, setSelectedPlots] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [phases, setPhases] = useState([]);
  const [propertyParams, setPropertyParams] = useState(null);
  const [clearPlotSelection, setClearPlotSelection] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isFetchingBankAccounts, setIsFetchingBankAccounts] = useState(true);

  useEffect(() => {
    let record = state?.record ?? null;
    if (!isNewAgreement && record) {
      initializeFormFields(record);
    }
  }, [state]);

  useEffect(() => {
    fetchBankAccountInterfaces();
    fetchCodes();
    fetchBlocks();
  }, []);

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

  const fetchCodes = () => {
    codesService
      .fetchCodes({
        type: 'PaymentMode',
      })
      .then((response) => {
        const content = response?.data || [];
        setPaymentModes(content);
      })
      .catch((error) =>{});
  };

  const initializeFormFields = (record) => {
    setPurchaseType(record?.purchaseType);

    formRef?.current.setFieldsValue({
      effectiveDate: record?.effectiveDate
        ? moment(record?.effectiveDate)
        : null,
      purchaseType: record?.purchaseType,
      purchasePrice: record?.purchasePrice,
      depositAmount: record?.depositAmount,
      numberOfInstallments: record?.numberOfInstallments,
      firstInstallmentDate: record?.firstInstallmentDate
        ? moment(record?.firstInstallmentDate, 'YYYY-MM-DD')
        : null,
      installmentAmount: record?.installmentAmount,
      modeOfInstallment: record?.modeOfInstallment,
      saleAgreementOwner: record?.saleAgreementOwner,
      depositAmountTransactionNumber: record?.depositAmountTransactionNumber,
      depositTransactionDate: record?.depositTransactionDate
        ? moment(record?.depositTransactionDate, 'YYYY-MM-DD')
        : null,

      remarks: record?.remarks,
    });
  };

  const onFinish = (values) => {
    if (!setSelectedPlots.length) {
      toast.warning('Please select property');
      return;
    }
    if (!selectedMembers.length) {
      toast.warning('Please select member');
      return;
    }
    values.saleAgreementOwner = selectedMarketer?.id;
    values.property = selectedPlots;
    values.member = selectedMembers;
    values.effectiveDate = values?.effectiveDate?.format('YYYY-MM-DD') ?? null;
    values.firstInstallmentDate =
      values?.firstInstallmentDate?.format('YYYY-MM-DD') ?? null;
    values.depositTransactionDate =
      values?.depositTransactionDate?.format('YYYY-MM-DD') ?? null;
    if (isNewAgreement) {
      doSave(values);
    } else {
      doUpdate(values);
    }
  };

  const doSave = (values) => {
    setIsSubmitBtnLoading(true);
    purchaseAgreementService
      .createPurchaseAgreement(values)
      .then((resp) => {
        toast.success('New  agreement created successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const doUpdate = (values) => {
    setIsSubmitBtnLoading(true);
    purchaseAgreementService
      .updatePurchaseAgreement(state.record.id, values)
      .then((resp) => {
        toast.success('Sale agreement details updated successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };


  const selectPlot = (data) => {
    setSelectedPlots(data);
  };
  const selectMember = (data) => {
    setSelectedMembers(data);
  };

  const handleCalculateInstallmentAmount = (e, type) => {
    let purchasePrice = form.getFieldValue('purchasePrice');
    let depositAmount = form.getFieldValue('depositAmount');
    let numberOfInstallments = form.getFieldValue('numberOfInstallments');
    if (!purchasePrice || !depositAmount || !numberOfInstallments) {
      formRef?.current.setFieldsValue({
        installmentAmount: 0,
      });
      return;
    }

    let updatedValues = {};

    if (type === 'purchasePrice') {
      updatedValues.installmentAmount = Math.round(
        (e - depositAmount) / numberOfInstallments
      );
    } else if (type === 'depositAmount') {
      updatedValues.installmentAmount = Math.round(
        (purchasePrice - e) / numberOfInstallments
      );
    } else if (type === 'numberOfInstallments') {
      updatedValues.installmentAmount = Math.round(
        (purchasePrice - depositAmount) / e
      );
    }

    formRef?.current.setFieldsValue(updatedValues);
  };

  const selectMarketer = (data) => {
    setSelectedMarketer(data);
  };

  const handlePaymentModeChange = (e) => {
    if (purchaseType === 'Cash') {
      getTransactionNumber();
    }
  };
  
  const getTransactionNumber = () => {
    purchaseAgreementService.fetchTransactionNumber().then((resp) => {
      formRef?.current.setFieldsValue({
        depositAmountTransactionNumber: resp?.data ?? null,
      });
    });
  };

  const handlePurchaseTypeChange = (e) => {
    let paymentMode = form.getFieldValue('paymentMode');
    setPurchaseType(e);
    if (e === 'Cash' && paymentMode) {
      getTransactionNumber();
    }
  };

  const handleBlockChange = (val) => {
    formRef.current?.setFieldsValue({
      phaseId: undefined,
    });
    setClearPlotSelection(!clearPlotSelection);
    if (val) {
      let params = { blockId: val };
      setPropertyParams((prev) => ({ ...prev, blockId: val }));
      fetchPhases(params);

      setPropertyParams((prev) => ({ ...prev, phaseId: null }));
    } else {
      setPropertyParams((prev) => ({ ...prev, blockId: null }));
      setPhases([]);
    }
  };

  const handlePhaseChange = (val) => {
    setClearPlotSelection(!clearPlotSelection);
    if (val) {
      setPropertyParams((prev) => ({ ...prev, phaseId: val }));
    } else {
      setPropertyParams((prev) => ({ ...prev, phaseId: null }));
    }
  };
  return (
    <Card
      type='inner'
      title={
        <Space>
          <Button
            type='link'
            style={{ width: '15px' }}
            icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
            onClick={() => handleBack()}
          />
          <span>{isNewAgreement ? 'Create' : 'Update'} Sale Agreement</span>
        </Space>
      }
    >
      <Row gutter={[8, 10]}>
        <Col span={24}>
          <Form
            {...formItemLayout}
            layout='vertical'
            form={form}
            ref={formRef}
            onFinish={onFinish}
          >
            <Row gutter={[10, 12]}>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Block No.'
                  name='blockId'
                  rules={[
                    {
                      required: true,
                      message: 'Block no. is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear
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
                  >
                    {blocks.map((block) => (
                      <Option value={block.id} key={block.id}>
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
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Phase'
                  name='phaseId'
                  rules={[
                    {
                      required: true,
                      message: 'Phase is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    onChange={handlePhaseChange}
                    showSearch
                    placeholder='Select a phase'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {phases.map((phase) => (
                      <Option value={phase.id} key={phase.id}>
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
                              convertToLowerThenCapitalize(phase.phaseName)) ||
                              ''}
                            {' - '}
                            {phase?.blockName}
                          </Space>
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Property'
                  name='property'
                  rules={[
                    {
                      required: false,
                      message: 'Property is required!',
                    },
                  ]}
                >
                  <PlotSearch
                    showUnAllocatedOnly
                    multipleSelection
                    plot={selectPlot}
                    defaultVal={state?.record?.propertyBasicData ?? []}
                    defaultPropertyParams={propertyParams}
                    clear={clearPlotSelection}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
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
                  <MemberSearch
                    multipleSelection
                    member={selectMember}
                    defaultVal={state?.record?.memberBasicData ?? []}
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  initialValue={purchaseType}
                  label='Purchase Type'
                  name='purchaseType'
                  rules={[
                    {
                      required: true,
                      message: 'Purchase type is required!',
                    },
                  ]}
                >
                  <Select
                    onChange={handlePurchaseTypeChange}
                    style={{ width: '100%' }}
                    placeholder='Select purchase type'
                    options={[
                      { value: 'Cash', label: 'Cash' },
                      { value: 'Installment', label: 'Installment' },
                    ]}
                  />
                </Form.Item>
              </Col>
              {purchaseType === 'Installment' && (
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Mode of Installment'
                    name='modeOfInstallment'
                    rules={[
                      {
                        required: true,
                        message: 'Mode of installment is required!',
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      placeholder='Select mode of installment'
                      options={[
                        { value: 'Daily', label: 'Daily' },
                        { value: 'Weekly', label: 'Weekly' },
                        { value: 'Monthly', label: 'Monthly' },
                        { value: 'Quarterly', label: 'Quarterly' },
                        { value: 'BiAnnually', label: 'BiAnnually' },
                        { value: 'Annually', label: 'Annually' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  name='paymentMode'
                  label='Mode of Payment'
                  rules={[
                    { required: true, message: 'Payment mode is required' },
                  ]}
                >
                  <Select
                    onChange={handlePaymentModeChange}
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
              <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  name={'depositBankAccountId'}
                  label={`Bank Account`}
                  rules={[
                    {
                      required: true,
                      message: `Bank account is required`,
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
                    options={bankAccounts.map((account) => {
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
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Purchase Price'
                  name='purchasePrice'
                  rules={[
                    {
                      required: true,
                      message: 'Purchase price is required!',
                    },
                  ]}
                >
                  <InputNumber
                    onChange={(e) =>
                      handleCalculateInstallmentAmount(e, 'purchasePrice')
                    }
                    style={{ width: '100%' }}
                    min={0}
                    placeholder='Enter purchase price'
                  />
                </Form.Item>
              </Col>

              {purchaseType === 'Installment' && (
                <>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='Deposit Amount'
                      name='depositAmount'
                      rules={[
                        {
                          required: true,
                          message: 'Deposit amount is required!',
                        },
                      ]}
                    >
                      <InputNumber
                        onChange={(e) =>
                          handleCalculateInstallmentAmount(e, 'depositAmount')
                        }
                        min={0}
                        style={{ width: '100%' }}
                        placeholder='Enter deposit amount'
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='No of Installments'
                      name='numberOfInstallments'
                      rules={[
                        {
                          required: true,
                          message: 'Number of installments is required!',
                        },
                      ]}
                    >
                      <InputNumber
                        onChange={(e) =>
                          handleCalculateInstallmentAmount(
                            e,
                            'numberOfInstallments'
                          )
                        }
                        min={0}
                        style={{ width: '100%' }}
                        placeholder='Enter number of installments'
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='Installment Amount'
                      name='installmentAmount'
                      rules={[
                        {
                          required: true,
                          message: 'Installment amount is required!',
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder='Enter installment amount'
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='First Installment Date'
                      name='firstInstallmentDate'
                      rules={[
                        {
                          required: true,
                          message: 'First installment date is required!',
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder='Select first installment date'
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Transaction Number (Deposit Amount)'
                  name='depositAmountTransactionNumber'
                  rules={[
                    {
                      required: true,
                      message: 'Deposit amount transaction number required!',
                    },
                  ]}
                >
                  <Input placeholder=' Enter deposit amount transaction number' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Deposit Transaction Date'
                  name='depositTransactionDate'
                  rules={[
                    {
                      required: true,
                      message: 'Deposit transaction date required!',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder='Select deposit transaction date'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Sale Agreement Date'
                  name='effectiveDate'
                  rules={[
                    {
                      required: true,
                      message: 'Sale agreement is required!',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder='Select agreement date'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Marketer'
                  name='saleAgreementOwner'
                  rules={[
                    {
                      required: false,
                      message: 'Marketer required!',
                    },
                  ]}
                >
                  <MarketerSearch marketer={selectMarketer} />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Remarks'
                  name='remarks'
                  rules={[
                    {
                      required: true,
                      message: 'Remarks required!',
                    },
                  ]}
                >
                  <Input.TextArea placeholder='Type your remarks' rows={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col span={24} className='d-flex justify-content-end'>
                <Button
                  style={{ marginRight: '10px' }}
                  htmlType='submit'
                  loading={isSubmitBtnLoading}
                >
                  {isNewAgreement ? 'Submit' : 'Update'}
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={isSubmitBtnLoading}
                >
                  {isNewAgreement ? 'Submit And Print' : 'Update And Print'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Card>
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

export default NewPurchaseAgreement;
