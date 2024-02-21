import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Button, Space, Form, Input, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast } from "react-toastify";
import { leadService } from "../../../_services/lead.service";

const FtLeadForm = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

  useEffect(() => {
    let record = state?.record ?? null;
    if (record) {
      initializeFormFields(record);
    }
  }, [state]);

  const initializeFormFields = (record) => {
    formRef?.current.setFieldsValue({
      leadSource: record.leadSource,
      leadStatus: record.leadStatus,
      leadOwner: record.leadOwner,
      leadPriority: record.leadPriority,
      leadContactNo: record.leadContactNo,
      leadEmailAddress: record.leadEmailAddress,
      leadContactPerson: record.leadContactPerson,
      leadBlockPhase: record.leadBlockPhase,
      followUpAction: record.followUpAction,
    });
  };

  const onFinish = (values) => {
    if (!state) {
      doSave(values);
    } else {
      console.log("hello")
      doUpdate(values);
    }
  };

  const doSave = (values) => {
    setIsSubmitBtnLoading(true);
    leadService
      .createLead(values)
  };
  const doUpdate = (values) => {
    setIsSubmitBtnLoading(true);
    leadService
      .editLead(state.record.id,values)
    setIsSubmitBtnLoading(false)
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Card
      type="inner"
      title={
        <Space>
          <Button
            type="link"
            style={{ width: "15px" }}
            icon={<AiOutlineArrowLeft style={{ width: "100%" }} />}
            onClick={() => handleBack()}
          />
          <span>{!state ? "Create" : "Update"} Lead</span>
        </Space>
      }
    >
      <Row gutter={[8, 10]}>
        <Col span={24}>
          <Form
            {...formItemLayout}
            layout="vertical"
            form={form}
            ref={formRef}
            onFinish={onFinish}
          >
            <Row gutter={[10, 12]}>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Source"
                  name="leadSource"
                  rules={[
                    {
                      required: true,
                      message: "Lead source is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Lead Source" />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Status"
                  name="leadStatus"
                  rules={[
                    {
                      required: true,
                      message: "Lead Status is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter lead Status" />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Owner"
                  name="leadOwner"
                  rules={[
                    {
                      required: true,
                      message: "Lead Owner is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter leadOwner" />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Priority"
                  name="leadPriority"
                  rules={[
                    {
                      required: true,
                      message: "Lead priority is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Lead Priority" />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Contact No"
                  name="leadContactNo"
                  rules={[
                    {
                      required: true,
                      message: "Lead Contact No is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Lead Contact No" />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Email Address"
                  name="leadEmailAddress"
                  rules={[
                    {
                      required: true,
                      message: "Email address is required!",
                      type: "email",
                    },
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Lead Contact Person"
                  name="leadContactPerson"
                  rules={[
                    {
                      required: false,
                      message: "Lead Contact Person is required!",
                    },
                  ]}
                >
                  <Input placeholder="Lead Contact Person address" />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Desired Block/Phase"
                  name="leadBlockPhase"
                  rules={[
                    {
                      required: true,
                      message: "Desired block/phase is required!",
                    },
                  ]}
                >
                  <Input placeholder="Desired block/phase address" />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label="Follow Up Action"
                  name="followUpAction"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input placeholder="Follow up action address" />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col span={24} className="d-flex justify-content-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitBtnLoading}
                >
                  {!state ? "Submit" : "Update"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Card>
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

export default FtLeadForm;
