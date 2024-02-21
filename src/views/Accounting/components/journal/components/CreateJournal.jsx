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
// import styled from 'styled-components';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
// const StyledForm = styled(Form)`
//   .ant-form-item {
//     margin-bottom: 0px !important;
//   }
// `;
// const StyledRow = styled(Row)`
//   background: #fbfbfb;
//   border: 1px solid #d9d9d9;
//   border-radius: 6px;
// `;

let id = 2;

const CreateJournal = ({ history }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [accountsList, setAccountsList] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [transType, setTransType] = useState([]);

  useEffect(() => {
    accountingService.getLiteAccount().then((res) => {
      setAccountsList(res.data);
    });

    TransactionService.fetchTransactionType().then((res) => {
      setTransType(res.data);
    });
  }, []);

  const remove = (k) => {
    const keys = form.getFieldValue('keys');

    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };

  const add = () => {
    const keys = form.getFieldValue('keys');
    console.log('Adding:\n', keys);
    const nextKeys = keys.concat(id++);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const handleAmount = (value, index) => {
    const amountArray = form.getFieldValue('amount');
    const typeArray = form.getFieldValue('type');

    const type = typeArray.filter((type) => type);
    const amount = amountArray.filter((amount) => amount);

    amount[index] = value;

    let newList = type.map((item, i) => ({
      type: item,
      amount: Number(amount[i]),
    }));

    const debitList = newList.filter((item) => item.type === 'Debit');
    const creditList = newList.filter((item) => item.type === 'Credit');

    switch (type[index]) {
      case 'Debit':
        setTotalDebit(debitList.reduce((acc, item) => acc + item.amount, 0));
        break;
      case 'Credit':
        setTotalCredit(creditList.reduce((acc, item) => acc + item.amount, 0));
        break;

      default:
        break;
    }

    form.setFieldsValue({
      amount: amount,
    });
  };

  const handleTypeChange = (newType, index) => {
    const amountArray = form.getFieldValue('amount');
    const typeArray = form.getFieldValue('type');

    const type = typeArray.filter((type) => type);
    const amount = amountArray.filter((amount) => amount);

    amount[index] = 0;

    let newList = type.map((item, i) => ({
      type: item,
      amount: Number(amount[i]),
    }));

    const debitList = newList.filter((item) => item.type === 'Debit');
    const creditList = newList.filter((item) => item.type === 'Credit');

    switch (newType) {
      case 'Credit':
        setTotalDebit(debitList.reduce((acc, item) => acc + item.amount, 0));
        break;
      case 'Debit':
        setTotalCredit(creditList.reduce((acc, item) => acc + item.amount, 0));
        break;

      default:
        break;
    }

    form.setFieldsValue({
      amount: amount,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (totalDebit !== totalCredit || totalCredit < 1 || totalDebit < 1) {
      message.warning('Please balance debit and credit');
    } else {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { keys, accounts, description, type, amount, ...valObject } =
            values;

          let entries = keys.map((key) => ({
            accountNumber: accounts[key],
            description: description[key],
            amount: amount[key],
            type: type[key],
          }));

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
            ...valObject,
            creditors: creditors,
            debtors: debtors,
            clerk: 'system',
            date: valObject.transactionDate.format('YYYY-MM-DD'),
            description: values.narration,
          };

          console.log(journalEntry);
          doSave(journalEntry);
        }
      });
    }
  };

  const doSave = async (journal) => {
    setIsSaving(true);

    try {
      const data = JSON.stringify(journal);
      const response = await journalService.createJournal(data);
      message.info(response.data.message);
      setIsSaving(false);
      handleBackToList();
    } catch (error) {
      setIsSaving(false);
    }
  };

  const handleBackToList = () => {
    form.resetFields();
    navigate('/accounting/journals');
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };

  form.setFieldsValue({
    keys: [0, 1],
  });

  // getFieldDecorator('keys', { initialValue: [0, 1] });
  const keys = form.getFieldValue('keys');
  console.log('Keys', keys);

  const formItems = keys.map((k, index) => (
    <Row type='flex' key={k} className='accounts-form mb-2'>
      <Col span={8}>
        <FormItem
          {...formItemLayout}
          label={'Account'}
          required={false}
          key={k}
          className='mb-3 mt-3'
          name={`accounts[${k}]`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              message: 'Please select account or delete this field.',
            },
          ]}
        >
          <Select
            showSearch
            placeholder={'Select Account'}
            optionFilterProp='children'
            size='small'
            style={{ width: '100%', marginRight: 2 }}
          >
            {accountsList.map((d) => (
              <Option key={d.accountNumber} title={d.accountName}>
                {d.accountName}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      <Col span={6}>
        <FormItem
          {...formItemLayout}
          label={'Description'}
          required={false}
          key={k}
          className='mb-3 mt-3'
          name={`description[${k}]`}
        >
          <Input />
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem
          {...formItemLayout}
          label={'Type'}
          required={false}
          key={k}
          className='mb-3 mt-3'
          name={`type[${k}]`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              message: 'Please select type or delete this field.',
            },
          ]}
        >
          <Select
            showSearch
            placeholder={'Select Type'}
            optionFilterProp='children'
            onChange={(value) => handleTypeChange(value, k)}
            size='small'
            style={{ width: '100%', marginRight: 8 }}
          >
            <Option key='Debit'>Debit</Option>
            <Option key='Credit'>Credit</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem
          {...formItemLayout}
          label={'Amount'}
          required={false}
          key={k}
          className='mb-3 mt-3'
          name={`amount[${k}]`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              message: 'Enter amount',
            },
          ]}
        >
          <InputNumber
            min={0}
            onChange={(value) => handleAmount(value, k)}
            size='small'
            placeholder='amount'
            style={{ width: '80%', marginRight: 8 }}
          />

          {keys.length > 1 ? (
            <CiCircleMinus
              className='dynamic-delete-button'
              type='minus-circle-o'
              onClick={() => remove(k)}
            />
          ) : null}
        </FormItem>
      </Col>
    </Row>
  ));

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
            <span>Journal Entry</span>
          </Space>
        }
      >
        <Form {...formItemLayout} onFinish={handleSubmit} form={form}>
          <Row>
            <Col span={10}>
              <FormItem
                label={'Date'}
                name={'transactionDate'}
                initialValue={dayjs()}
                rules={[{ required: true }]}
              >
                <DatePicker format={'YYYY-MM-DD'} placeholder={'Select Date'} />
              </FormItem>
            </Col>

            <Col span={10}>
              <FormItem label={'Journal#'} name={'transactionIdentifier'}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label={'Transaction Type'} name={'transactionType'}>
                <Select
                  placeholder={'Select transaction type'}
                  options={transType.map((d) => {
                    return { value: d, label: d };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <FormItem label={'Narration'} name={'narration'}>
                <TextArea rows={2} />
              </FormItem>
            </Col>
          </Row>

          <Row>
            {formItems}
            <Card
              extra={[
                <Button key='1' type='dashed' size='small' onClick={add}>
                  <AiOutlinePlus type='plus' /> {'Add Accounts'}
                </Button>,
              ]}
            />
          </Row>
          <br />
          <Row bordered='true'>
            <Col span={7} className='float-right'>
              <Space.Compact>
                <Tag style={{ width: '40%', height: 32 }} color='green'>
                  {'Debit'}
                </Tag>
                <Input
                  value={totalDebit}
                  readOnly={true}
                  style={{ width: '60%' }}
                />
              </Space.Compact>

              <Space.Compact style={{ marginTop: 5 }}>
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
          </Row>
          <br />
          <Divider />
          <br />
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={handleBackToList}>Cancel</Button>
              <Button
                style={{ marginLeft: 8 }}
                type='primary'
                htmlType='submit'
                loading={isSaving}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateJournal;
