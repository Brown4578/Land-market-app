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
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { countiesAndSubCounties } from './CountiesAndSubCounties';
import { blockService } from '../../../_services';

const { Option } = Select;
const NewBlock = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isNewBlock } = state;

  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedCountySubCounties, setSelectedCountySubCounties] = useState(
    []
  );

  useEffect(() => {
    if (isNewBlock === false) {
      formRef.current?.setFieldsValue({
        blockName: state.record?.blockName,
        subCounty: state.record?.subCounty,
        county: state.record?.county,
        division: state.record?.division,
        location: state.record?.location,
      });
    }
  }, [isNewBlock]);

  const onFinish = (values) => {
    setIsSubmitBtnLoading(true);
    if (selectedCounty) {
      values = { ...values, county: selectedCounty };
    }


    if (isNewBlock) {
      doSave(values);
    } else {
      doUpdate(values);
    }
  };

  const doSave = (values) => {
    blockService
      .createBlock(values)
      .then(() => {
        toast.success('New block created successfully');
        setIsSubmitBtnLoading(false);
        navigate(-1);
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };
  const doUpdate = (values) => {
    setIsSubmitBtnLoading(false);
    toast.success('Block details updated successfully');
    navigate(-1);
  };

  const handleCountyChange = (val) => {
    formRef.current?.setFieldsValue({
      subCounty: '',
    });
    if (val) {
      let value = JSON.parse(val);
      setSelectedCounty(value.name);
      setSelectedCountySubCounties(value.sub_counties);
    } else {
      setSelectedCounty(null);
      setSelectedCountySubCounties([]);
    }
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
          <span>{isNewBlock ? 'Add New' : 'Update'} Block</span>
        </Space>
      }
      type='inner'
    >
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
              label='Block Name'
              name='blockName'
              rules={[
                {
                  required: true,
                  message: 'Block name is required!',
                },
              ]}
            >
              <Input placeholder='Enter block name' />
            </Form.Item>
          </Col>

          <Col lg={8} md={8} sm={12} xs={24}>
            <Form.Item
              label='County'
              name='county'
              rules={[
                {
                  required: true,
                  message: 'County is required!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder='Select county'
                onChange={handleCountyChange}
              >
                <Option
                  value={''}
                  key={'empty'}
                  style={{ color: 'rgba(0, 0, 0, .4)' }}
                >
                  - Select county -
                </Option>
                {countiesAndSubCounties.map((county, index) => (
                  <Option value={JSON.stringify(county)} key={index}>
                    <Space>{county.name}</Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Form.Item
              label='Sub County'
              name='subCounty'
              rules={[
                {
                  required: true,
                  message: 'Sub-county is required!',
                },
              ]}
            >
              <Select showSearch placeholder='Select sub-county'>
                <Option
                  value={''}
                  key={'empty'}
                  style={{ color: 'rgba(0, 0, 0, .4)' }}
                >
                  - Select sub-county -
                </Option>
                {selectedCountySubCounties.map((subCounty, index) => (
                  <Option value={subCounty} key={index}>
                    {subCounty}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={8} md={8} sm={12} xs={24}>
            <Form.Item
              label='Division'
              name='division'
              rules={[
                {
                  required: true,
                  message: 'Division is required!',
                },
              ]}
            >
              <Input placeholder='Enter division name' />
            </Form.Item>
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Form.Item
              label='Location'
              name='location'
              rules={[
                {
                  required: true,
                  message: 'Location is required!',
                },
              ]}
            >
              <Input placeholder='Enter location name' />
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
              {isNewBlock ? 'Create Block' : 'Update Block'}
            </Button>
          </Col>
        </Row>
      </Form>
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

export default NewBlock;
