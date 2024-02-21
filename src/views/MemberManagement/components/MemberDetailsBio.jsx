import React, { useState } from 'react';
import { Col, Form, Input, Select, Space } from 'antd';
import { countiesAndSubCounties } from '../../Blocks/components/CountiesAndSubCounties';

const { Option } = Select;

const MemberDetailsBio = (props) => {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedCountySubCounties, setSelectedCountySubCounties] = useState(
    []
  );

  const handleCountyChange = (val) => {
    props.formRef.current?.setFieldsValue({
      subCounty: '',
    });
    if (val) {
      let value = JSON.parse(val);
      setSelectedCounty(value.name);
      props.setSelectedCounty(value.name);
      setSelectedCountySubCounties(value.sub_counties);
    } else {
      setSelectedCounty(null);
      props.setSelectedCounty(null);
      setSelectedCountySubCounties([]);
    }
  };

  return (
    <>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Form.Item
          label='ID No.'
          name='idNumber'
          rules={[
            {
              required: true,
              message: 'ID no. is required!',
            },
          ]}
        >
          <Input placeholder='Enter ID no.' />
        </Form.Item>
      </Col>

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
          name='secondName'
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
          label='Gender'
          name='gender'
          rules={[
            {
              required: true,
              message: 'Gender is required!',
            },
          ]}
        >
          <Select showSearch placeholder='Select gender'>
            <Option value={'Male'} key={'Male'}>
              Male
            </Option>
            <Option value={'Female'} key={'Female'}>
              Female
            </Option>
          </Select>
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
          label='Phone No. 2'
          name='phoneNumber2'
          rules={[
            {
              required: false,
              message: 'Secondary phone no. is required!',
            },
          ]}
        >
          <Input placeholder='Enter secondary no.' />
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

      <Col lg={8} md={8} sm={12} xs={24}>
        <Form.Item
          label='County'
          name='county'
          rules={[
            {
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
              message: 'Location is required!',
            },
          ]}
        >
          <Input placeholder='Enter location' />
        </Form.Item>
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Form.Item
          label='Sub Location'
          name='subLocation'
          rules={[
            {
              required: false,
              message: 'Sub-location is required!',
            },
          ]}
        >
          <Input placeholder='Enter sub-location' />
        </Form.Item>
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Form.Item
          label='Home Address'
          name='homeAddress'
          rules={[
            {
              required: false,
              message: 'Home address is required!',
            },
          ]}
        >
          <Input placeholder='Enter home address' />
        </Form.Item>
      </Col>
    </>
  );
};

export default MemberDetailsBio;
