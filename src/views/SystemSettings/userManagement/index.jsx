import React, { useEffect, useState } from 'react';
import Users from './Users/components';
import RolesAndPermissions from './RolesandPermissions/RolesandPermissions';
import { Button, Card, Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const UserManagement = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [currentKey, setCurrentKey] = useState(null);

  const items = [
    {
      key: 'Users',
      label: 'Users',
      children: <Users />,
    },
    {
      key: 'Roles & Permissions',
      label: 'Roles & Permissions',
      children: <RolesAndPermissions />,
    },
  ];

  useEffect(() => {
    if (location) {
    }
    if (state && state?.currentTab) {
      setCurrentKey(state.currentTab);
    } else {
      setCurrentKey('Users');
    }
  }, [state]);

  const onTabChange = (e) => {
    setCurrentKey(e);
    if (e === 'Users') {
      navigate(location.pathname, { state: {} });
    }
  };

  return (
    <>
      <Card>
        <Tabs
          defaultActiveKey={currentKey}
          activeKey={currentKey}
          onChange={(e) => onTabChange(e)}
          items={items}
          type='card'
          tabBarExtraContent={
            (currentKey === 'Users' && (
              <Button
                size='small'
                type='primary'
                key={'users'}
                onClick={() => {
                  navigate('/user-management/user/edit-user', {
                    state: { isAddNew: true },
                  });
                }}
              >
                New User
              </Button>
            )) ||
            (currentKey === 'Roles & Permissions' && (
              <Button
                size='small'
                type='primary'
                key={'roles'}
                onClick={() => {
                  navigate('/user-management/roles/add', {
                    state: { isAddNew: true },
                  });
                }}
              >
                New Role
              </Button>
            ))
          }
        />
      </Card>
    </>
  );
};

export default UserManagement;
