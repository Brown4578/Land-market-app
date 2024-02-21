import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { RoleColumns } from './roleColumns';
import { rolesService } from '../../../../_services/roles.service';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RolesAndPermissions = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  const columns2 = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text, row) => (
        <Button
          size='small'
          type='link'
          onClick={() =>
            navigate('/user-management/assign-permissions', {
              state: { roleList: row },
            })
          }
        >
          {text}
        </Button>
      ),
    },
    ...RoleColumns,
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      width: '5%',
      render: (text, row) => (
        <Button
          size='small'
          type='link'
          onClick={() =>
            navigate('/user-management/roles/edit', {
              state: { isAddNew: false, roleList: row },
            })
          }
          icon={<EditOutlined />}
        />
      ),
    },
  ];

  useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = () => {
    setIsLoading(false);
    rolesService
      .fetchAllRoles()
      .then((response) => {
        const content = response.data?.body || [];
        setDataSource(content);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const onDeleteRole = (row) => {
    setIsLoading(true);
    rolesService
      .deleteRole(row.id)
      .then((response) => {
        let roles = dataSource.filter((item) => item.id !== row.id);
        setDataSource(roles);
        setIsLoading(false);
        message.success('Delete successful');
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <div id='content'>
      <Table
        style={{ marginTop: 2 }}
        loading={isLoading}
        bordered
        dataSource={dataSource}
        columns={columns2}
        size='small'
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default RolesAndPermissions;
