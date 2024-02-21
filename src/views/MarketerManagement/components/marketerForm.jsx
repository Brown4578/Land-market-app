import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Space, Form, Input, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { marketerService } from '../../../_services/marketer.service';

const MarketerForm = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

  useEffect(() => {
    let record = state?.record ?? null;
    if (record) {
      initializeFormFields(record);
    }
  }, [state]);

  const initializeFormFields = (record) => {
    formRef?.current.setFieldsValue({
      firstName: record.firstName,
      otherNames: record.otherNames,
      surname: record.surname,
      phoneNumber: record.phoneNumber,
      emailAddress: record.emailAddress,
    });
  };

  const onFinish = (values) => {
    if (!state) {
      doSave(values);
    } else {
      doUpdate(values);
    }
  };

  const doSave = (values) => {
    setIsSubmitBtnLoading(true);
    marketerService
      .createMarketer(values)
      .then((resp) => {
        toast.success('Marketer created successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const doUpdate = (values) => {
    setIsSubmitBtnLoading(true);
    marketerService
      .updateMarketer(state.record.id, values)
      .then((resp) => {
        toast.success('Marketer details updated successfully');
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
          <span>{!state ? 'Create' : 'Update'} Marketer</span>
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
                  label='First Name'
                  name='firstName'
                  rules={[
                    {
                      required: true,
                      message: 'First name is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter first name' />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Second Name'
                  name='otherNames'
                  rules={[
                    {
                      required: true,
                      message: 'Second name is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter second name' />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Surname'
                  name='surname'
                  rules={[
                    {
                      required: true,
                      message: 'Surname is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter surname' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Phone No.'
                  name='phoneNumber'
                  rules={[
                    {
                      required: true,
                      message: 'Phone number is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter phone no.' />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Email Address'
                  name='emailAddress'
                  rules={[
                    {
                      required: false,
                      message: 'A valid email is required!',
                      type: 'email',
                    },
                  ]}
                >
                  <Input placeholder='Enter email address' />
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
                  {!state ? 'Submit' : 'Update'}
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

export default MarketerForm;
