import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Form, Input, Button, Space, Select } from 'antd';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { plotService, scannedDocsService } from '../../../_services';
import ImageUploader from './ImageUploader';

const AddNewDoc = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [plotsData, setPlotsData] = useState([]);
  const [fileToSave, setFileToSave] = useState(null);

  useEffect(() => {}, [fileToSave]);

  useEffect(() => {
    getPlots();
  }, []);

  const onFinish = (values) => {
    if (fileToSave === null) {
      toast.warning('Please upload a file');
    }
    doSave(values);
  };

  const doSave = (values) => {
    const formData = new FormData();
    formData.append('file', fileToSave);
    setIsSubmitBtnLoading(true);
    scannedDocsService
      .uploadImage(values, formData)
      .then(() => {
        toast.success('Document uploaded successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const getPlots = (params) => {
    params = { ...params, pageNo: 0, pageSize: 10 };

    setPlotsData([]);
    plotService
      .fetchPlots(params)
      .then((resp) => {
        let body = resp.data.body;
        let content = body?.content ?? [];
        setPlotsData(content);
      })
      .catch((error) => {
        setPlotsData([]);
      });
  };

  const handleSearchPlot = debounce((e) => {
    let params = { term: e };
    getPlots(params);
  }, 800);

  const handleBack = () => {
    navigate(-1);
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
              onClick={() => handleBack()}
            />
            <span>New Document Upload</span>
          </Space>
        }
        type='inner'
      >
        <Form
          {...formItemLayout}
          layout='vertical'
          form={form}
          ref={formRef}
          onFinish={onFinish}
        >
          <Row gutter={[10, 12]}>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Plot'
                name='plotId'
                rules={[
                  {
                    required: true,
                    message: 'Plot is required!',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder='Select plot'
                  onSearch={handleSearchPlot}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={plotsData.map((plot) => {
                    return {
                      value: plot.id,
                      label:
                        plot.plotNumber +
                        ' - ' +
                        plot.certificateNumber +
                        ' - ' +
                        plot.blockName +
                        ' - ' +
                        plot.phaseName,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Directory Name'
                name='directoryName'
                rules={[
                  {
                    required: true,
                    message: 'Directory name is required!',
                  },
                ]}
              >
                <Input
                  placeholder='Enter directory name'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Remarks'
                name='remarks'
                rules={[
                  {
                    required: false,
                    message: 'Remarks are required!',
                  },
                ]}
              >
                <Input.TextArea
                  placeholder='Enter directory name'
                  style={{ width: '100%' }}
                  rows={1}
                />
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Form.Item
                label='Scanned Doc'
                name='file'
                rules={[
                  {
                    required: false,
                    message: 'Scanned doc is required!',
                  },
                ]}
              >
                <ImageUploader fileToSave={setFileToSave} />
              </Form.Item>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col span={24} className='d-flex justify-content-end'>
              <Button
                type='primary'
                htmlType='submit'
                loading={isSubmitBtnLoading}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

export default AddNewDoc;
