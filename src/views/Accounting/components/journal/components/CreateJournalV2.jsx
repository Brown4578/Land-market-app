import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  DatePicker,
  Input,
  Button,
  message,
  Card,
  Divider,
  Select,
  InputNumber,
  Tag,
  Space,
} from 'antd';
import {
  journalService,
  accountingService,
  TransactionService,
} from '../../../../../_services';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { CiCircleMinus } from 'react-icons/ci';
import { AiOutlinePlus } from 'react-icons/ai';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const CreateJournalV2 = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [transType, setTransType] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    accountingService.fetchAccounts({ state: 'OPEN' }).then((res) => {
      setAccountsList(res.data.body?.content || []);
    });

    TransactionService.fetchTransactionType().then((res) => {
      const data = (res?.data || []).filter(
        (item) => item === 'JournalVoucher'
      );
      setTransType(data);
    });
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const onFinish = (values) => {
    console.log('Form values:\n', values);
    if (totalDebit !== totalCredit || totalCredit < 1 || totalDebit < 1) {
      toast.warning('Please balance debit and credit');
    } else {
      const entries = form.getFieldsValue().accounts_entries || [];

      const debtors = entries
        .filter((e) => e.type === 'Debit')
        .map((d) => ({
          description: d.description,
          accountNumber: d.accountNumber,
          amount: d.amount,
        }));

      const creditors = entries
        .filter((e) => e.type === 'Credit')
        .map((c) => ({
          description: c.description,
          accountNumber: c.accountNumber,
          amount: c.amount,
        }));

      let journalEntry = {
        ...values,
        creditors: creditors,
        debtors: debtors,
        clerk: 'system',
        transactionDate: values.transactionDate.format('YYYY-MM-DD'),
        description: values.narration,
      };

      console.log('Final form data:\n', journalEntry);

      doSave(journalEntry);
    }
  };

  const doSave = async (journal) => {
    setIsLoading(true);

    try {
      const data = JSON.stringify(journal);
      const response = await journalService.createJournal(data);
      toast.success(response.data.message);
      setIsLoading(false);
      handleBack();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const calculateTotalAmounts = () => {
    const values = form.getFieldsValue().accounts_entries || [];

    const totalDebitCalc = values.reduce(
      (acc, { type, amount }) => (type === 'Debit' ? acc + (amount || 0) : acc),
      0
    );

    const totalCreditCalc = values.reduce(
      (acc, { type, amount }) =>
        type === 'Credit' ? acc + (amount || 0) : acc,
      0
    );

    setTotalDebit(totalDebitCalc);
    setTotalCredit(totalCreditCalc);
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
              onClick={() => handleBack()}
            />
            Journal Entry
          </Space>
        }
      >
        <Form
          name='journal-entry-form'
          onFinish={onFinish}
          form={form}
          autoComplete='off'
          layout='vertical'
          initialValues={{
            accounts_entries: [
              {
                accountNumber: undefined,
                description: '',
                type: 'Debit',
                amount: 0,
              },
              {
                accountNumber: undefined,
                description: '',
                type: 'Credit',
                amount: 0,
              },
            ],
          }}
        >
          <Row gutter={[10, 0]}>
            <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                label={'Date'}
                name={'transactionDate'}
                initialValue={dayjs()}
                rules={[{ required: true }]}
              >
                <DatePicker
                  format={'YYYY-MM-DD'}
                  placeholder={'Select Date'}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item label={'Journal#'} name={'transactionIdentifier'}>
                <Input />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                label={'Transaction Type'}
                name={'transactionType'}
                initialValue={'JournalVoucher'}
              >
                <Select
                  placeholder={'Select transaction type'}
                  options={transType.map((d) => {
                    return { value: d, label: d };
                  })}
                />
              </Form.Item>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
              <Form.Item label={'Narration'} name={'narration'}>
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>

            <Col span={24} className='mt-5'>
              <Form.List name='accounts_entries'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row
                        key={key}
                        size='small'
                        style={{
                          display: 'flex',
                          padding: '10px 5px',
                          margin: 0,
                          marginBottom: 8,
                          width: '100%',
                          border: '.5px solid #dedede',
                          borderRadius: '10px',
                        }}
                        align='baseline'
                        gutter={[10, 0]}
                      >
                        <Col xxl={6} xl={6} lg={6} md={8} sm={11} xs={24}>
                          <Form.Item
                            {...restField}
                            label='Account'
                            name={[name, 'accountNumber']}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                message:
                                  'Please select account or delete this field.',
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder={'Select Account'}
                              optionFilterProp='children'
                              style={{ width: '100%' }}
                              options={accountsList.map((d) => {
                                return {
                                  value: d.identifier,
                                  label: d.name,
                                };
                              })}
                            />
                          </Form.Item>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
                          <Form.Item
                            {...restField}
                            label={'Description'}
                            name={[name, 'description']}
                          >
                            <Input.TextArea rows={1} />
                          </Form.Item>
                        </Col>
                        <Col xxl={5} xl={5} lg={5} md={7} sm={11} xs={24}>
                          <Form.Item
                            {...restField}
                            label='Type'
                            name={[name, 'type']}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                message: 'Type is required',
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder={'Select Type'}
                              optionFilterProp='children'
                              style={{ width: '100%' }}
                              options={[
                                { value: 'Debit', label: 'Debit' },
                                { value: 'Credit', label: 'Credit' },
                              ]}
                              onChange={() => calculateTotalAmounts()}
                            />
                          </Form.Item>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={23}>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            label='Amount'
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                message: 'Amount is required',
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder='Amount'
                              onChange={() => calculateTotalAmounts()}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={1}>
                          <MinusCircleOutlined
                            onClick={() => {
                              remove(name);
                              calculateTotalAmounts();
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Col span={24} className='d-flex justify-content-end'>
                      <Col xxl={6} xl={6} lg={6} md={10} sm={12} xs={24}>
                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                            block
                          >
                            Add Accounts
                          </Button>
                        </Form.Item>
                      </Col>
                    </Col>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          <Col className='d-flex justify-content-end mt-4 mb-4' bordered='true'>
            <Col xxl={7} xl={7} lg={7} md={7} sm={12} xs={24}>
              <Space.Compact style={{ width: '100%' }}>
                <Tag style={{ width: '40%', height: 32 }} color='green'>
                  {'Debit'}
                </Tag>
                <Input
                  value={totalDebit}
                  readOnly={true}
                  style={{ width: '60%' }}
                />
              </Space.Compact>

              <Space.Compact style={{ width: '100%', marginTop: 5 }}>
                <Tag style={{ width: '40%', height: 32 }} color='blue'>
                  {'Credit'}
                </Tag>
                <Input
                  value={totalCredit}
                  readOnly={true}
                  style={{ width: '60%' }}
                />
              </Space.Compact>
            </Col>
          </Col>
          <Col span={24} className='d-flex justify-content-end'>
            <Col xxl={4} xl={4} lg={4} md={6} sm={12} xs={24}>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={isLoading}
                  block
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Form>
      </Card>
    </div>
  );
};

export default CreateJournalV2;
