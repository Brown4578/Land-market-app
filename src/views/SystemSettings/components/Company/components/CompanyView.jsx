import { Button, Card, Col, Form, Row, Input, Avatar } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { companyDetailsService } from '../../../../../_services';
import { BackArrow } from '../../../common/BackArrow';
import { useUserContext } from '../../../../../_helpers/userContext';
import { toast } from 'react-toastify';
import ImageUploader from '../../../../../_helpers/utils/ImageUploader';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import './assets/css/index.css';
import { MdArrowBack, MdOutlineModeEditOutline } from 'react-icons/md';
const CompanyView = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [fileToSave, setFileToSave] = useState(null);
  const [defaultFileToSave, setDefaultFileToSave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { updateCompanyName } = useUserContext();

  useEffect(() => {
    fetchCompany();
  }, []);
  useEffect(() => {
    if (fileToSave) {
      form.setFieldsValue({ companyLogo: fileToSave });
    }
  }, [fileToSave]);

  const handleFileToSave = (file) => {
    let base64 = null;
    if (file) {
      base64 = file.split(',')[1];

      form.setFieldsValue({ companyLogo: base64 });
    }

    setFileToSave(base64);
  };
  const fetchCompany = (params) => {
    setIsLoading(true);
    companyDetailsService
      .fetchCompanyDetails(params)
      .then((response) => {
        const respData = response?.data || [];

        setCompanyDetails(respData?.id ? respData : []);
        // setFileToSave(respData?.companyLogo);
        setDefaultFileToSave(respData?.companyLogo);
        setIsLoading(false);
        if (respData?.id) {
          form.setFieldsValue(respData);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const onFinish = (values) => {
    if (companyDetails?.id) {
      doUpdate(values);
    } else {
      doSave(values);
    }
  };

  const doSave = (payload) => {
    setIsLoading(true);
    companyDetailsService
      .createCompany(payload)
      .then((response) => {
        setShowForm(false);
        toast.success('Company details saved successfully');
        const respData = response?.data || [];
        form.resetFields();
        fetchCompany();
        updateCompanyName(respData?.companyName);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const doUpdate = (payload) => {
    setIsLoading(true);
    companyDetailsService
      .createCompany(payload)
      .then((response) => {
        setShowForm(false);
        toast.success('Company details updated successfully');
        const respData = response?.data || [];
        form.resetFields();
        fetchCompany();
        updateCompanyName(respData?.companyName);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handleResetImage = () => {
    setDefaultFileToSave(null);
  };

  return (
    <div id='content'>
      <Card
        // type='inner'
        title={
          <>
            {showForm ? (
              <Button
                type='link'
                icon={<MdArrowBack />}
                onClick={() => setShowForm(false)}
                style={{ fontSize: 'inherit' }}
              />
            ) : (
              <BackArrow />
            )}{' '}
            {` ${
              showForm ? `${companyDetails?.id ? 'Update' : 'Create'}` : ''
            } Company Details`}
          </>
        }
        bodyStyle={{
          padding: showForm ? '' : '1.5px',
          border: '1px solid black',
          backgroundColor: '#f0f2f5',
        }}
        headStyle={{ backgroundColor: '#f0f2f5', border: '1px solid black' }}
        className='card-content'
      >
        {showForm ? (
          <Form layout='vertical' form={form} ref={formRef} onFinish={onFinish}>
            <Row gutter={[24, 24]}>
              <Col lg={18} md={18} sm={24} xs={24}>
                <Row gutter={[24, 24]}>
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Company Name'
                      name='companyName'
                      rules={[
                        {
                          required: true,
                          message: 'Company name is required!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter company name' />
                    </Form.Item>
                  </Col>
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Legal Identity No'
                      name='legalIdentityNumber'
                    >
                      <Input
                        style={{ width: '100%' }}
                        placeholder='Legal identity no.'
                      />
                    </Form.Item>
                  </Col>
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Phone No.'
                      name='phone1'
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
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item label='Country' name='country'>
                      <Input placeholder='Enter country' />
                    </Form.Item>
                  </Col>
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item label='Town' name='town'>
                      <Input placeholder=' Enter town' />
                    </Form.Item>
                  </Col>

                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Phone No. 2'
                      name='phone2'
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
                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Email Address'
                      name='emailAddress'
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

                  <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Form.Item
                      label='Address'
                      name='address'
                      rules={[
                        {
                          required: true,
                          message: 'Address is required!',
                        },
                      ]}
                    >
                      <Input placeholder='Enter  address' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Form.Item label='Company Logo' name='companyLogo'>
                      <ImageUploader
                        saveBase64
                        fileToSave={handleFileToSave}
                        defaultImage={
                          defaultFileToSave
                            ? `data:image/*;base64,${defaultFileToSave}`
                            : null
                        }
                        resetImage={handleResetImage}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Form.Item className='d-flex justify-content-end'>
                  <Button
                    style={{ marginRight: '20px' }}
                    onClick={() => {
                      setShowForm(false);
                    }}
                  >
                    Close
                  </Button>
                  <Button loading={isLoading} htmlType='submit' type='primary'>
                    {companyDetails?.id ? 'Update' : 'Save'}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              <Col className='d-flex justify-content-end mt-1 ' span={24}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setShowForm(true)}
                  style={{ marginRight: '20px', color: '#20247b' }}
                >
                  Update Profile
                </Button>
              </Col>
            </Row>
            <section className='section about-section gray-bg' id='about'>
              <div className='container'>
                <Row gutter={[24, 24]}>
                  <Col lg={10} md={12} sm={24} xs={24}>
                    <div className='about-avatar-wrapper'>
                      <div className='about-avatar'>
                        {defaultFileToSave ? (
                          <img
                            src={`data:image/*;base64,${defaultFileToSave}`}
                            title=''
                            alt=''
                          />
                        ) : (
                          <Avatar size={200} icon={<UserOutlined />} />
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={14} md={12} sm={24} xs={24}>
                    <div className='about-text go-to'>
                      <h3 className='dark-color'>
                        {companyDetails?.companyName}
                      </h3>

                      <div className='row about-list'>
                        <Row>
                          <Col span={12}>
                            <div className='media'>
                              <label>Email</label>
                              <p>{companyDetails?.emailAddress}</p>
                            </div>
                            <div className='media'>
                              <label>Phone Number</label>
                              <p>{companyDetails?.phone1}</p>
                            </div>
                            <div className='media'>
                              <label>Secondary Phone </label>
                              <p>{companyDetails?.phone2}</p>
                            </div>
                            <div className='media'>
                              <label>Country</label>
                              <p>{companyDetails?.country}</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className='media'>
                              <label>Town</label>
                              <p>{companyDetails?.town}</p>
                            </div>
                            <div className='media'>
                              <label>Legal Identity No</label>
                              <p>{companyDetails?.legalIdentityNumber}</p>
                            </div>
                            <div className='media'>
                              <label>Town</label>
                              <p>{companyDetails?.town}</p>
                            </div>
                            <div className='media'>
                              <label>Address</label>
                              <p>{companyDetails?.address}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>
          </>
        )}
      </Card>
    </div>
  );
};

export default CompanyView;
