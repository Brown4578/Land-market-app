import React, { useState, useEffect } from 'react';
import { rolesService } from '../../../../_services/roles.service';
import styled from 'styled-components';
import {
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Divider,
  Switch,
  message,
  Space,
} from 'antd';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertToUppercaseThenReplaceWhiteSpacesWithUnderScore } from '../../../../_helpers/utils/StringManipulator';
import { toast } from 'react-toastify';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 5px !important;
  }
`;

const AddRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [isLoading, setIsLoading] = useState(false);
  const [initialState, setInitialState] = useState(state ? state.roleList : '');

  useEffect(() => {
    setInitialState(state ? state.roleList : '');
  }, [state]);

  const createRole = (data) => {
    setIsLoading(true);
    rolesService
      .createRoleV2(data)
      .then((response) => {
        setIsLoading(false);
        toast.success('User role created successfully');
        handleBackToList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const editRole = (data, id) => {
    setIsLoading(true);
    rolesService
      .editRole(id, data)
      .then((response) => {
        setIsLoading(false);
        toast.success('User role updated successfully');
        handleBackToList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (values) => {
    values = {
      ...values,
      roleName: convertToUppercaseThenReplaceWhiteSpacesWithUnderScore(
        values.roleName
      ),
    };

    if (initialState) {
      editRole(values, initialState.id);
    } else {
      createRole(values);
    }
  };

  const handleBackToList = () => {
    navigate('/user-management', {
      state: { currentTab: 'Roles & Permissions' },
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };

  return (
    <div id='content'>
      <Card
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={handleBackToList}
            />
            <span>{state.isAddNew ? 'Create' : 'Update'} Role</span>
          </Space>
        }
      >
        <StyledForm onFinish={handleSubmit} {...formItemLayout}>
          <Form.Item
            label={'Role Name'}
            name='roleName'
            initialValue={initialState ? initialState.roleName : ''}
            rules={[
              {
                required: true,
                message: 'Role name is required',
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={'Disabled'}
            name={'disabled'}
            valuePropName='checked'
            initialValue={initialState ? initialState.disabled : false}
          >
            <Switch />
          </Form.Item>

          <Divider style={{ marginBottom: 5 }} />
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={handleBackToList}>Cancel</Button>
              {initialState ? (
                <Button
                  loading={isLoading}
                  style={{ marginLeft: 8 }}
                  type='primary'
                  htmlType='submit'
                >
                  Edit
                </Button>
              ) : (
                <Button
                  loading={isLoading}
                  style={{ marginLeft: 8 }}
                  type='primary'
                  htmlType='submit'
                >
                  Save
                </Button>
              )}
            </Col>
          </Row>
        </StyledForm>
      </Card>
    </div>
  );
};

export default AddRole;
