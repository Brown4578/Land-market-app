import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form, Input, message, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { rolesService, userService } from '../../../../../_services';
import { toast } from 'react-toastify';

const EditUser = (props) => {
  const navigate = useNavigate();
  const locData = useLocation();
  const [form] = Form.useForm();
  const [isNewUser, setIsNewUser] = useState(false);
  const [roles, setRoles] = useState([]);
  const location = locData.state;
  const [isLoading, setLoading] = useState();
  const { Option } = Select;

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    setIsNewUser(location.isAddNew);
  }, [location?.isAddNew]);

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  // const roles = ['ROLE_ADMIN', 'ROLE_USER'];

  const getRoles = () => {
    rolesService.fetchAllRoles().then((resp) => {
      const respData = resp.data?.body || [];
      setRoles(respData);
    });
  };

  const newUser = (values) => {
    setLoading(true);
    let params = { ...values };
    userService
      .createUser(params)
      .then((resp) => {
        toast.success('User added successfully');
        setLoading(false);
        navigate('/user-management', { state: { isFromUserForm: true } });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const updateUser = (values) => {
    setLoading(true);
    userService
      .updateUser({ id: location?.record?.id, ...values })
      .then((resp) => {
        toast.success('User information updated successfully');
        setLoading(false);
        handleBackToList();
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  const onFinish = (data) => {
    isNewUser ? newUser(data) : updateUser(data);
  };

  const handleBackToList = (data) => {
    navigate(-1);
  };

  return (
    <div>
      <Card
        type='inner'
        style={{ minHeight: '70vh' }}
        title={
          <>
            <FontAwesomeIcon
              className='arrow-left'
              icon={faArrowLeft}
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => {
                navigate('/user-management', {
                  state: { isFromServicePointForm: true },
                });
              }}
            />{' '}
            <span> {`${isNewUser ? 'New' : 'Update'}`} User</span>
          </>
        }
      >
        <Form
          id='form'
          layout='vertical'
          onFinish={onFinish}
          initialValues={location?.userInfo}
          form={form}
        >
          <Row gutter={[12, 12]}>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Username'
                name='userName'
                initialValue={location?.record?.userName}
                rules={[{ required: true, message: 'Username is required!' }]}
              >
                <Input placeholder='Username' />
              </Form.Item>
            </Col>

            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Name'
                name='fullName'
                initialValue={location?.record?.fullName}
                rules={[
                  {
                    required: true,
                    message: 'Name is required!',
                  },
                ]}
              >
                <Input placeholder='Name' />
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Email'
                name='email'
                initialValue={location?.record?.email}
                rules={[
                  {
                    type: 'email',
                    required: true,
                    message: 'Valid email is required!',
                  },
                ]}
              >
                <Input placeholder='Email e.g johndoe@example.com' />
              </Form.Item>
            </Col>

            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='User Role'
                name='roleId'
                initialValue={location?.record?.roleId}
                rules={[
                  {
                    required: true,
                    message: 'Specify at least one role',
                  },
                ]}
              >
                <Select
                  // mode='multiple'
                  showSearch
                  showArrow
                  allowClear
                  placeholder='Select role'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {roles &&
                    roles.map((role, index) => (
                      <Option value={role.id} key={role.id}>
                        {formatString(role.roleName)}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {isNewUser ? (
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                }}
              >
                <Button
                  style={{
                    margin: '0 8px',
                  }}
                  onClick={() => {
                    navigate('/user-management', {
                      state: { isFromUserForm: true },
                    });
                  }}
                >
                  Close
                </Button>
                <Button loading={isLoading} type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Col>
            ) : (
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                }}
              >
                <Button
                  style={{
                    margin: '0 8px',
                  }}
                  onClick={() => {
                    navigate('/user-management', {
                      state: { isFromUserForm: true },
                    });
                  }}
                >
                  Close
                </Button>
                <Button loading={isLoading} type='primary' htmlType='submit'>
                  Update
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    </div>
  );
};
export default EditUser;
