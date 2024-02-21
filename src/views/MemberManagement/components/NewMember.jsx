import React, { useState, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  Button,
  Space,
  DatePicker,
  Input,
} from 'antd';
import MemberDetailsBio from './MemberDetailsBio';
import GroupMembers from './GroupMembers';
import { memberService } from '../../../_services';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import moment from 'moment';

const NewMember = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [memberType, setMemberType] = useState('INDIVIDUAL');
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);

  const onFinish = (values) => {
    if (memberType === 'INDIVIDUAL') {
      values = { ...values, county: selectedCounty };
      doSaveMember(values);
    } else {
      doSaveGroupMembers(values);
    }
  };

  const doSaveMember = (values) => {
    setIsSubmitBtnLoading(true);
    memberService
      .createMember(values)
      .then(() => {
        setIsSubmitBtnLoading(false);
        toast.success('Member registered successfully!');
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };
  const doSaveGroupMembers = (values) => {
    setIsSubmitBtnLoading(true);
    const newValues = {
      memberType: values.memberType,
      firstName: values.groupName,
      surname: values.groupName,
      groupData: {
        ...values,
        registrationDate: moment(values?.registrationDate).format('YYYY-MM-DD'),
        groupMembersData: values.groupMembersData.map((member) => {
          {
            return { ...member, county: JSON.parse(member.county).name };
          }
        }),
      },
    };
    memberService
      .createMember(newValues)
      .then(() => {
        setIsSubmitBtnLoading(false);
        toast.success('Group members registered successfully');
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const handleMemberTypeChange = (e) => {
    setMemberType(e);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div id='content'>
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
            New member(s)
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
              <Row className='mb-3'>
                <Col span={24}>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Form.Item
                      label='Member Type'
                      name='memberType'
                      rules={[
                        {
                          required: true,
                          message: 'Member type is required!',
                        },
                      ]}
                      initialValue={memberType}
                    >
                      <Select
                        placeholder='Select type'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={handleMemberTypeChange}
                        options={[
                          { value: 'INDIVIDUAL', label: 'Individual' },
                          { value: 'GROUP', label: 'Group' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              {/* Individual member details */}
              <Row gutter={[8, 10]}>
                {memberType === 'INDIVIDUAL' ? (
                  <MemberDetailsBio
                    formRef={formRef}
                    setSelectedCounty={setSelectedCounty}
                  />
                ) : (
                  <>
                    <Row gutter={[8, 10]}>
                      <Col lg={6} md={6} sm={12} xs={24}>
                        <Form.Item
                          label='Identification no.'
                          name={'identificationNumber'}
                          rules={[
                            {
                              required: true,
                              message: 'Identification no. is required!',
                            },
                          ]}
                        >
                          <Input placeholder='Enter identification no.' />
                        </Form.Item>
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={24}>
                        <Form.Item
                          label='Group Name'
                          name={'groupName'}
                          rules={[
                            {
                              required: true,
                              message: 'Group name is required!',
                            },
                          ]}
                        >
                          <Input placeholder='Enter group name' />
                        </Form.Item>
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={24}>
                        <Form.Item
                          label='Reg. Date'
                          name={'registrationDate'}
                          rules={[
                            {
                              required: true,
                              message: 'Registration date is required!',
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder='Select reg. date'
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={24}>
                        <Form.Item
                          label='Comments'
                          name={'comments'}
                          rules={[
                            {
                              required: false,
                              message: 'Comments are required!',
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={1}
                            placeholder='Enter comments'
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <GroupMembers formRef={formRef} />
                  </>
                )}
              </Row>
              <Row className='mt-3'>
                <Col span={24} className='d-flex justify-content-end'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={isSubmitBtnLoading}
                  >
                    {memberType === 'INDIVIDUAL'
                      ? 'Create Member'
                      : ' Create Group'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
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

export default NewMember;
