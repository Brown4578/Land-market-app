import React, { useState } from 'react';
import { Col, Form, Input, Select, Space, Button, Divider, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { countiesAndSubCounties } from '../../Blocks/components/CountiesAndSubCounties';

const { Option } = Select;

const GroupMembers = (props) => {
  const [selectedCountySubCounties, setSelectedCountySubCounties] = useState(
    []
  );

  const handleCountyChange = (val) => {
    props.formRef.current?.setFieldsValue({
      subCounty: '',
    });
    if (val) {
      let value = JSON.parse(val);
      setSelectedCountySubCounties(value.sub_counties);
    } else {
      setSelectedCountySubCounties([]);
    }
  };

  return (
    <>
      <Form.List name='groupMembersData'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              // <Space
              //   key={key}
              //   style={{
              //     display: 'flex',
              //     marginBottom: 8,
              //   }}
              //   align='baseline'
              // >
              <Row key={key} gutter={[8, 10]}>
                <Divider orientation='left'>Member {key + 1}</Divider>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='ID No.'
                    {...restField}
                    name={[name, 'idNumber']}
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
                    {...restField}
                    name={[name, 'firstName']}
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
                    {...restField}
                    name={[name, 'secondName']}
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
                    {...restField}
                    name={[name, 'surname']}
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
                    {...restField}
                    name={[name, 'gender']}
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
                    {...restField}
                    name={[name, 'phoneNumber']}
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
                    {...restField}
                    name={[name, 'phoneNumber2']}
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
                    {...restField}
                    name={[name, 'emailAddress']}
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
                    {...restField}
                    name={[name, 'county']}
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
                    {...restField}
                    name={[name, 'subCounty']}
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
                    {...restField}
                    name={[name, 'division']}
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
                    {...restField}
                    name={[name, 'location']}
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
                    {...restField}
                    name={[name, 'subLocation']}
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
                    {...restField}
                    name={[name, 'homeAddress']}
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

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Row>
              // </Space>
            ))}
            <Col span={24} className='mt-3'>
              <Row>
                <Col span={12}>
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Form.List>
    </>
  );
};

export default GroupMembers;
