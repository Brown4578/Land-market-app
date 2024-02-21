import { Form, Input, Button, Card, Row, Col, Select } from 'antd';
import { useEffect, useState } from 'react';
import { accountingService, codesService } from '../../../../../_services';
import { BackArrow } from '../../../common/BackArrow';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AccountsSearch } from '../../../../../_components/AccountsSearch';
const { Option } = Select;

const AccountInterphaseForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [codeTypes, setCodeTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleBackTolist = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchCodeTypes();
    if (location.state?.data) {
      setIsEditing(true);
      const formData = location.state?.data;
      form.setFieldsValue({
        interfaceName: formData?.interfaceName,
      });
      let account = {
        id: formData?.accountId,
        name: formData?.accountName,
      };

      setSelectedAccount(account);
    } else {
      setIsEditing(false);
    }
  }, [location]);

  const handleSubmit = (values) => {
    if (!selectedAccount)
      return toast.warning('Cannot update without an account');
    let valuesToSubmit = {
      ...values,
      accountId: selectedAccount?.id,
    };
    doUpdate(valuesToSubmit);
  };

  const fetchCodeTypes = () => {
    setIsLoading(true);
    accountingService
      .getAccounts()
      .then((response) => {
        const codeTypes = response?.data;
        setCodeTypes(codeTypes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const doUpdate = (payload) => {
    setIsLoading(true);
    accountingService
      .updateAccountInterface(payload)
      .then((resp) => {
        toast.success('Account interface updated successfully');
        handleBackTolist();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleSelectAccount = (data) => {
    setSelectedAccount(data);
  };

  return (
    <div id='content'>
      <Card
        title={
          <>
            <BackArrow /> Edit Account Interface
          </>
        }
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout='vertical'
          style={{
            maxWidth: '700px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Row gutter={[20, 10]}>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                name='interfaceName'
                label='Interface Name'
                rules={[
                  {
                    required: true,
                    message: 'Interface name is required',
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item name='Account' label='Account'>
                <AccountsSearch
                  account={handleSelectAccount}
                  defaultAccountValue={selectedAccount}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item className='d-flex justify-content-end'>
                <Button htmlType='submit' type='primary'>
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AccountInterphaseForm;
