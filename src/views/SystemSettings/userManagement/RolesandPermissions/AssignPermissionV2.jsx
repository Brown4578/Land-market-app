import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, message, Space } from 'antd';
import { permissions } from './permission';
import { rolesService } from '../../../../_services/roles.service';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import PermissionTree from './PermissionTree';
import { toast } from 'react-toastify';

let arrPermissions = [];

const AssignPermission = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location ? location?.state?.roleList : '';
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    getPermissions();
  }, [location.state]);

  const selectedRoles = (e) => {
    setSelectedPermissions(e);
  };

  const getPermissions = async () => {
    rolesService
      .getPermissions(role.id)
      .then((resp) => {
        const body = resp.data?.body || [];
        body.forEach((permission) => {
          arrPermissions.push(permission.permissionName);
        });
        setSelectedPermissions(arrPermissions);
      })
      .catch((err) => {});
  };

  const handleSubmit = () => {
    const payload = {
      roleId: role.id,
      permissions: selectedPermissions,
    };

    rolesService.createRolePermissions(payload).then(() => {
      toast.success(`${role?.roleName} permissions updated successfully`);
      handleBackToList();
    });
  };

  const handleBackToList = () => {
    setSelectedPermissions([]);
    arrPermissions = [];
    navigate('/user-management', {
      state: { currentTab: 'Roles & Permissions' },
    });
  };

  return (
    <div id='content' className='card-minified-body'>
      <Card
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => handleBackToList()}
            />
            <span>Assign Permission:</span>
            {` `}
            <span
              style={{ fontWeight: 'bold', color: '#50abff', fontSize: '12px' }}
            >
              #{role.roleName}
            </span>
          </Space>
        }
      >
        <Row gutter={[10, 13]}>
          <Col span={24}>
            <PermissionTree
              permissions={permissions}
              assignedPermission={arrPermissions}
              selectedPermissions={selectedRoles}
            />
          </Col>
          <Col span={24} className='d-flex justify-content-end'>
            {/* <Button type='primary' onClick={() => handleSubmit()}>
              Submit
            </Button> */}
            <Button
              style={{ maxWidth: '200px' }}
              block
              type='primary'
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AssignPermission;
