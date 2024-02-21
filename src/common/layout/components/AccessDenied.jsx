import React from 'react';
import { Result, Button } from 'antd';
import { userService } from '../../../_services';

const AccessDenied = () => {
  const logout = () => {
    userService.logout();
  };
  return (
    <Result
      status='403'
      title='403'
      subTitle="Sorry, you're not authorized to access any resources."
      extra={
        <Button type='primary' onClick={logout}>
          Logout
        </Button>
      }
    />
  );
};

export default AccessDenied;
