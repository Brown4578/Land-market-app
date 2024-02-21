import React, { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Col,
  Input,
  Divider,
  Row,
  Select,
  Checkbox,
  message,
  Space,
} from 'antd';
import { accountingService } from '../../../../../_services';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

const AddAccount = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [isSubAccount, setSubAccount] = useState(false);
  const [parentAccount, setParentAccount] = useState([]);

  const handleSubmit = (values) => {
    accountingService
      .createAccountV2(values)
      .then((response) => {
        message.success('Account created successfully');
        form.resetFields();
        setParentAccount([]);
      })
      .catch((errors) => console.log('Errors:', errors));
  };

  const handleBackTolist = () => {
    form.resetFields();
    navigate(-1);
  };

  const toggleIsSubAccount = () => {
    setSubAccount(!isSubAccount);
  };

  const handleChange = (value) => {
    if (!value) return;
    accountingService
      .fetchAccounts({ type: value })
      .then((response) => {
        let data = response.data.body?.content || [];
        // let open = data.filter((item) => item.state !== "NON_TRANSACTING")
        setParentAccount(data);
      })
      .catch((error) => {
        console.log('Error:\n\n', error);
      });
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  return (
    <Card
      title={
        <Space>
          <Button
            type='link'
            style={{ width: '15px' }}
            icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
            onClick={() => handleBackToList()}
          />
          <span>Create Account</span>
        </Space>
      }
    >
      <Form onFinish={handleSubmit} form={form} {...formItemLayout}>
        <Form.Item
          label={'Account Type'}
          name={'accountType'}
          rules={[
            {
              required: true,
              message: 'Account type is required',
            },
          ]}
        >
          <Select
            showSearch
            placeholder={'Select account type'}
            onChange={handleChange}
            options={[
              { value: 'EXPENSE', label: 'Expense' },
              { value: 'LIABILITY', label: 'Liability' },
              { value: 'ASSET', label: 'Asset' },
              { value: 'REVENUE', label: 'Revenue' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={'Account Name'}
          name={'name'}
          rules={[
            {
              required: true,
              message: 'Account name is required',
            },
          ]}
        >
          <Input placeholder='Enter account name' />
        </Form.Item>
        <Form.Item
          label={'Account Number'}
          name={'accountNumber'}
          rules={[
            {
              required: true,
              message: 'Account number is required',
            },
          ]}
        >
          <Input placeholder='Enter account no.' />
        </Form.Item>

        <Form.Item label=' ' colon={false}>
          <Checkbox onChange={toggleIsSubAccount} checked={isSubAccount}>
            Is Sub Account
          </Checkbox>
        </Form.Item>
        {isSubAccount && (
          <Form.Item label={'Parent Account'} name={'parentAccountIdentifier'}>
            <Select
              showSearch
              placeholder={'Select account'}
              // onChange={handleChange}
              options={[
                { value: '', label: 'Select account', color: '#bfbfbf' },
                ...(parentAccount &&
                  parentAccount.map((parent) => ({
                    value: parent.identifier,
                    label: parent.name,
                  }))),
              ]}
            />
          </Form.Item>
        )}

        <Divider style={{ marginBottom: 5 }} />
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={handleBackTolist}>Cancel</Button>
            <Button
              style={{ marginLeft: 8 }}
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddAccount;
