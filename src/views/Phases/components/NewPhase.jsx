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
  Tooltip,
  Radio,
  InputNumber,
  DatePicker,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { phaseService, blockService } from '../../../_services';

const { Option } = Select;

const NewPhase = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isNewPhase } = state;

  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [isFetchingBlocks, setIsFetchingBlocks] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    if (isNewPhase === false) {
      formRef.current?.setFieldsValue({
        // phase_code: state.record?.phase_code,
        phaseName: state.record?.phaseName,
        blockId: state.record?.blockId,
      });
    }
  }, [isNewPhase]);

  const fetchBlocks = (params) => {
    setIsFetchingBlocks(true);
    blockService
      .fetchBlocks(params)
      .then((resp) => {
        let content = resp.data?.body ?? [];
        setBlocks(content);
        setIsFetchingBlocks(false);
      })
      .catch((err) => {
        setIsFetchingBlocks(false);
      });
  };

  const onFinish = (values) => {
    setIsSubmitBtnLoading(true);
    const newValues = {
      ...values,
      saleCompletionTargetDate:
        values.saleCompletionTargetDate &&
        values.saleCompletionTargetDate.format('YYYY-MM-DD'),
    };
    if (isNewPhase) {
      doSave(newValues);
    } else {
      doUpdate(newValues);
    }
  };

  const doSave = (values) => {
    phaseService
      .createPhase(values)
      .then(() => {
        setIsSubmitBtnLoading(false);
        toast.success('New phase added successfully');
        navigate(-1);
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };
  const doUpdate = (values) => {
    setIsSubmitBtnLoading(false);
    toast.success('Phase details updated successfully');
  };

  return (
    <Card
      title={
        <Space>
          <Button
            type='link'
            style={{ width: '15px' }}
            icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
            onClick={() => navigate(-1)}
          />
          <span>{isNewPhase ? 'Add New' : 'Update'} Phase</span>
        </Space>
      }
      type='inner'
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
              {/* <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  label='Phase Code'
                  name='phase_code'
                  rules={[
                    {
                      required: true,
                      message: 'Phase code is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter phase code' />
                </Form.Item>
              </Col> */}
              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  label='Phase Name'
                  name='phaseName'
                  rules={[
                    {
                      required: true,
                      message: 'Phase name is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter phase name' />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
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
                    showSearch
                    placeholder='Select a block'
                    optionFilterProp='children'
                    loading={isFetchingBlocks}
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
              <Col lg={12} md={12} sm={12} xs={24}>
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
                    style={{ width: '100%' }}
                    placeholder='Enter purchase price'
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  label='Sales Completion Target Date'
                  name='saleCompletionTargetDate'
                  rules={[
                    {
                      required: true,
                      message: 'Sales completion date is required!',
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder='Select completion date'
                    format={'YYYY-MM-DD'}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  label='Size'
                  name='size'
                  rules={[
                    {
                      required: true,
                      message: 'Size is required!',
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder='Specify the size'
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Form.Item
                  label='Comments'
                  name='comments'
                  rules={[
                    {
                      required: false,
                      message: 'Comments required!',
                    },
                  ]}
                >
                  <Input.TextArea rows={1} placeholder='Enter comments' />
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
                  {isNewPhase ? 'Create Phase' : 'Update Phase'}
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

export default NewPhase;
