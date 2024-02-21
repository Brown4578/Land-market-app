import React, { useEffect, useState } from 'react';
import '../assets/css/index.css';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { userService } from '../../../../_services';
import { message } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import {
  setAccessToken,
  setRefreshToken,
} from '../../../../_helpers/globalVariables';
import logo from '../../../../assets/img/favicon/propView365-logo.svg';

const Login = () => {
  const currentYear = new Date().getFullYear();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    userService.authenticate(values?.username, values?.password).then(
      (response) => {
        const { accessToken } = response.data;
        if (accessToken) {
          message.success(`Welcome ${values?.username}!`);
          setAccessToken(accessToken, true);
          setRefreshToken(accessToken);
          setLoading(false);
        } else {
          setLoading(false);
        }
      },
      (error) => {
        let message = 'User Deactivated or Does not exist';
        if (error) {
          setLoading(false);
          message = error?.response?.data;
        }

        dispatch(failure(error));
        setLoading(false);
      }
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id='main-login-container-wrapper'>
      <div className='bg-image'></div>
      <div className='limiter'>
        <div className='container-login box effect5'>
          <div className='wrap-login'>
            <div className='switch' id='switch-cnt'>
              <div className='form-icon'>
                <img src={logo} />
              </div>
            </div>
            <div className='login-form validate-form'>
              <span className='login-form-title'>Login</span>
              <Form
                className='login-form validate-form'
                name='login-form'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
              >
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name='username'
                      rules={[
                        {
                          required: true,
                          message: 'Username is required!',
                        },
                      ]}
                    >
                      <Input
                        style={{ color: '#4caf50' }}
                        allowClear
                        prefix={<FaUserAlt />}
                        className='form__input'
                        placeholder='Username'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name='password'
                      rules={[
                        {
                          required: true,
                          message: 'Password is required!',
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<RiLockPasswordLine />}
                        style={{ width: '100% !important' }}
                        className='form__input'
                        placeholder='Password'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className='container-login-form-btn'>
                      <div className='wrap-login-form-btn'>
                        <Button
                          loading={loading}
                          htmlType='submit'
                          className='login-form-btn'
                        >
                          login
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>

              <div className='text-center'>
                <span className='txt1'>
                  PropView365 ©{currentYear} All rights reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
