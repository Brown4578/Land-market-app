import { Form, Input, Button, Card, Row, Col, Select } from 'antd';
import { useEffect, useState } from 'react';
import { codesService } from '../../../../../_services';
import { BackArrow } from '../../../common/BackArrow';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Option } = Select;

const CodeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [codeTypes, setCodeTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleBackTolist = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchCodeTypes();
    if (location.state?.data) {
      setIsEditing(true);
      const formData = location.state?.data;
      form.setFieldsValue({
        code: formData?.code,
        codeValue: formData?.codeValue,
        description: formData?.description,
      });
    } else {
      setIsEditing(false);
    }
  }, [location]);

  const handleSubmit = (values) => {
    if (isEditing) {
      doUpdate(location.state?.data?.id, values);
    } else {
      doSave(values);
    }
  };

  const fetchCodeTypes = () => {
    setIsLoading(true);
    codesService
      .fetchCodeTypes()
      .then((response) => {
        const codeTypes = response?.data;
        setCodeTypes(codeTypes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const doSave = (payload) => {
    setIsLoading(true);
    codesService
      .createCode(payload)
      .then((response) => {
        toast.success('Code created successfully');
        handleBackTolist();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const doUpdate = (id, payload) => {
    if (!id) return toast.warning('Cannot update without id');
    setIsLoading(true);
    codesService
      .editCode(id, payload)
      .then((resp) => {
        toast.success('Code updated successfully');
        handleBackTolist();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <div id='content'>
      <Card
        title={
          <>
            <BackArrow /> {isEditing ? 'Edit' : 'New'} Parameter
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
                name='code'
                label='Parameter Type'
                rules={[
                  {
                    required: true,
                    message: 'Parameter Type is required',
                  },
                ]}
              >
                <Select
                  placeholder='Select parameter type'
                  style={{ width: '100%' }}
                >
                  {codeTypes.map((codeType) => (
                    <Option key={codeType} value={codeType}></Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                name='codeValue'
                label='Parameter Value'
                rules={[
                  {
                    required: true,
                    message: 'Parameter value is required',
                  },
                ]}
              >
                <Input placeholder='Enter parameter value' />
              </Form.Item>
            </Col>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item name='description' label='Description'>
                <TextArea placeholder='Description' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item className='d-flex justify-content-end'>
                <Button htmlType='submit' type='primary'>
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CodeForm;
