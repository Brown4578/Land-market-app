import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Descriptions,
  Tag,
  Badge,
  Collapse,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import {
  plotTransferService,
  memberService,
  plotService,
} from '../../../_services';
import {
  ExclamationCircleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { debounce } from 'lodash';

const { Option } = Select;

const dateFormat = 'yyyy-MM-dd';

const NewTransfer = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [plotsData, setPlotsData] = useState([]);
  const [membersFromData, setMembersFromData] = useState([]);
  const [selectedMemberFromData, setSelectedMemberFromData] = useState(null);
  const [membersToData, setMembersToData] = useState([]);
  const [selectedMemberToData, setSelectedMemberToData] = useState(null);
  const [modal, contextHolder] = Modal.useModal();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  useEffect(() => {
    getMembersDetail();
    getPlots();
  }, []);

  useEffect(() => {
    if (selectedMemberFromData === null || selectedMemberToData === null) {
      setIsBtnDisabled(true);
    }

    if (selectedMemberFromData && selectedMemberToData) {
      if (selectedMemberFromData.id === selectedMemberToData.id) {
        setIsBtnDisabled(true);
        toast.warning(
          "You're attempting to transfer the plot to the same member"
        );
      } else {
        setIsBtnDisabled(false);
      }
    }
  }, [selectedMemberToData, selectedMemberFromData]);

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

  const getMembersDetail = (params, isForMembersFrom) => {
    params = { ...params, pageNo: 0, pageSize: 10 };

    if (isForMembersFrom === null) {
      setMembersFromData([]);
      setMembersToData([]);
    } else if (isForMembersFrom) {
      setMembersFromData([]);
    } else {
      setMembersToData([]);
    }

    memberService
      .fetchMembers(params)
      .then((resp) => {
        let body = resp.data.body;
        let content = body?.content ?? [];
        if (isForMembersFrom === null || isForMembersFrom === undefined) {
          setMembersFromData(content);
          setMembersToData(content);
        } else if (isForMembersFrom) {
          setMembersFromData(content);
        } else {
          setMembersToData(content);
        }
      })
      .catch((error) => {
        setMembersFromData([]);
        setMembersToData([]);
      });
  };

  const onFinish = (values) => {
    setIsSubmitBtnLoading(true);

    values = {
      ...values,
      transferDate: moment(values.transferDate).format(dateFormat),
      transferFromId: selectedMemberFromData.id,
      transferToId: selectedMemberToData.id,
    };

    confirmTransfer(values);
  };

  const groupMembersInfo = (membersInfo) => {
    modal.info({
      title: 'Group members',
      width: '50%',
      content: (
        <>
          <Collapse
            size='small'
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            items={membersInfo.map((item, index) => {
              return {
                key: index,
                label:
                  item?.firstName +
                  ' ' +
                  item?.secondName +
                  ' ' +
                  item?.surname,
                children: (
                  <Descriptions
                    bordered
                    size='small'
                    column={{
                      xxl: 2,
                      xl: 2,
                      lg: 2,
                      md: 2,
                      sm: 1,
                      xs: 1,
                    }}
                  >
                    <Descriptions.Item label='Tel. 1'>
                      <a
                        style={{ textDecoration: 'none' }}
                        href={`tel:${item?.phoneNumber}`}
                      >
                        {item?.phoneNumber}
                      </a>
                    </Descriptions.Item>
                    {item.phoneNumber2 && (
                      <Descriptions.Item label='Tel. 2'>
                        <a
                          style={{ textDecoration: 'none' }}
                          href={`tel:${item?.phoneNumber2}`}
                        >
                          {item?.phoneNumber2}
                        </a>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label='Email Address'>
                      <a
                        style={{ textDecoration: 'none' }}
                        href={`mailto:${item?.emailAddress}`}
                      >
                        {item?.emailAddress}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item label='Home Address'>
                      {item?.homeAddress}
                    </Descriptions.Item>
                    <Descriptions.Item label='Gender'>
                      {item?.gender}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              };
            })}
          />
        </>
      ),
      okText: 'Close',
    });
  };

  const confirmTransfer = (formValues) => {
    modal.confirm({
      title: 'Confirm Transfer',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to proceed with the transfer?',
      okText: 'Proceed',
      onOk: () => {
        doSave(formValues);
      },
      cancelText: 'Cancel',
      onCancel: () => {
        setIsSubmitBtnLoading(false);
      },
    });
  };

  const doSave = (values) => {
    plotTransferService
      .createPlotTransfer(values)
      .then(() => {
        toast.success('Plot transfer processed successfully');
        setIsSubmitBtnLoading(false);
        navigate(-1);
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const handleTransferFromChange = (data) => {
    if (data) {
      let dataObj = JSON.parse(data);
      setSelectedMemberFromData(dataObj);
    } else {
      setSelectedMemberFromData(null);
    }
  };

  const handleTransferToChange = (data) => {
    if (data) {
      let dataObj = JSON.parse(data);
      setSelectedMemberToData(dataObj);
    } else {
      setSelectedMemberToData(null);
    }
  };

  const handleSearchPlot = debounce((e) => {
    let params = { term: e };
    getPlots(params);
  }, 800);

  return (
    <div id='content'>
      {contextHolder}
      <Card
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => navigate(-1)}
            />
            <span>Plot Transfer</span>
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
            <Col lg={6} md={6} sm={12} xs={24}>
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
            <Col lg={6} md={6} sm={12} xs={24}>
              <Form.Item
                label='Title No.'
                name='titleNo'
                rules={[
                  {
                    required: false,
                    message: 'Title number is required!',
                  },
                ]}
              >
                <Input placeholder='Enter title number' />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={12} xs={24}>
              <Form.Item
                label='Document No.'
                name='documentNumber'
                rules={[
                  {
                    required: true,
                    message: 'Document number is required!',
                  },
                ]}
              >
                <Input placeholder='Enter document number' />
              </Form.Item>
            </Col>

            <Col lg={6} md={6} sm={12} xs={24}>
              <Form.Item
                label='Transfer Date'
                name='transferDate'
                rules={[
                  {
                    required: true,
                    message: 'Transfer date is required!',
                  },
                ]}
              >
                <DatePicker
                  placeholder='Select transfer date'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            {/* Members from details */}
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card hoverable>
                <Col span={24}>
                  <Row gutter={[8, 10]}>
                    <Col span={24}>
                      <Form.Item
                        label='Transfer From'
                        name='transferFromId'
                        rules={[
                          {
                            required: true,
                            message: 'Transfer from member is required!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder='Select member'
                          onChange={handleTransferFromChange}
                        >
                          {membersFromData.map((member) => (
                            <Option
                              value={JSON.stringify(member)}
                              key={member.id}
                            >
                              {member.memberType === 'INDIVIDUAL' ? (
                                <div className='d-flex justify-content-between'>
                                  <span style={{ color: '#2db7f5' }}>
                                    {member.firstName +
                                      ' ' +
                                      member.secondName +
                                      ' ' +
                                      member.surname}
                                  </span>
                                  <Tag color='#2db7f5'>Individual</Tag>
                                </div>
                              ) : (
                                <div className='d-flex justify-content-between'>
                                  <span style={{ color: '#87d068' }}>
                                    {member.groupData.identificationNumber +
                                      ' - ' +
                                      member.groupData.groupName}
                                  </span>
                                  <Tag color='#87d068'>Group</Tag>
                                </div>
                              )}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    {selectedMemberFromData && (
                      <Col span={24}>
                        <Card hoverable>
                          <Descriptions
                            title='Member Info'
                            bordered
                            size='small'
                            column={{
                              xxl: 2,
                              xl: 1,
                              lg: 1,
                              md: 1,
                              sm: 1,
                              xs: 1,
                            }}
                          >
                            <Descriptions.Item label='Member Type'>
                              <Tag
                                color={
                                  selectedMemberFromData?.memberType ===
                                  'INDIVIDUAL'
                                    ? '#2db7f5'
                                    : '#87d068'
                                }
                              >
                                {selectedMemberFromData?.memberType ===
                                'INDIVIDUAL'
                                  ? 'Individual'
                                  : 'Group'}
                              </Tag>
                            </Descriptions.Item>

                            {selectedMemberFromData?.memberType ===
                            'INDIVIDUAL' ? (
                              <>
                                <Descriptions.Item label='Tel. 1'>
                                  {selectedMemberFromData?.phoneNumber}
                                </Descriptions.Item>
                                {selectedMemberFromData.phoneNumber2 && (
                                  <Descriptions.Item label='Tel. 2'>
                                    {selectedMemberFromData.phoneNumber2}
                                  </Descriptions.Item>
                                )}
                                <Descriptions.Item label='Email'>
                                  {selectedMemberFromData?.emailAddress}
                                </Descriptions.Item>
                                <Descriptions.Item label='County'>
                                  {selectedMemberFromData?.county}
                                </Descriptions.Item>
                                <Descriptions.Item label='Sub-county'>
                                  {selectedMemberFromData?.subCounty}
                                </Descriptions.Item>
                              </>
                            ) : (
                              <>
                                <Descriptions.Item label='Identification No.'>
                                  {
                                    selectedMemberFromData?.groupData
                                      .identificationNumber
                                  }
                                </Descriptions.Item>
                                <Descriptions.Item label='Group Name'>
                                  {selectedMemberFromData?.groupData.groupName}
                                </Descriptions.Item>
                                <Descriptions.Item label='Group members'>
                                  <Badge
                                    count={
                                      selectedMemberFromData?.groupData
                                        ?.groupMembersData.length ?? 0
                                    }
                                    onClick={() =>
                                      groupMembersInfo(
                                        selectedMemberFromData?.groupData
                                          ?.groupMembersData
                                      )
                                    }
                                    title='Click to view group members'
                                    style={{
                                      backgroundColor: 'purple',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Tag color='lime'>View members</Tag>
                                  </Badge>
                                </Descriptions.Item>
                                <Descriptions.Item label='Reg. Date'>
                                  {
                                    selectedMemberFromData?.groupData
                                      ?.registrationDate
                                  }
                                </Descriptions.Item>
                              </>
                            )}
                          </Descriptions>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Card>
            </Col>

            {/* Members to details */}
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card hoverable>
                <Col span={24}>
                  <Row gutter={[8, 10]}>
                    <Col span={24}>
                      <Form.Item
                        label='Transfer To'
                        name='transferToId'
                        rules={[
                          {
                            required: true,
                            message: 'Transfer to member is required!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder='Select member'
                          onChange={handleTransferToChange}
                        >
                          {membersToData.map((member) => (
                            <Option
                              value={JSON.stringify(member)}
                              key={member.id}
                            >
                              {member.memberType === 'INDIVIDUAL' ? (
                                <div className='d-flex justify-content-between'>
                                  <span style={{ color: '#2db7f5' }}>
                                    {member.firstName +
                                      ' ' +
                                      member.secondName +
                                      ' ' +
                                      member.surname}
                                  </span>
                                  <Tag color='#2db7f5'>Individual</Tag>
                                </div>
                              ) : (
                                <div className='d-flex justify-content-between'>
                                  <span style={{ color: '#87d068' }}>
                                    {member.groupData.identificationNumber +
                                      ' - ' +
                                      member.groupData.groupName}
                                  </span>
                                  <Tag color='#87d068'>Group</Tag>
                                </div>
                              )}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    {selectedMemberToData && (
                      <Col span={24}>
                        <Card hoverable>
                          <Descriptions
                            title='Member Info'
                            bordered
                            size='small'
                            column={{
                              xxl: 2,
                              xl: 1,
                              lg: 1,
                              md: 1,
                              sm: 1,
                              xs: 1,
                            }}
                          >
                            <Descriptions.Item label='Member Type'>
                              <Tag
                                color={
                                  selectedMemberToData?.memberType ===
                                  'INDIVIDUAL'
                                    ? '#2db7f5'
                                    : '#87d068'
                                }
                              >
                                {selectedMemberToData?.memberType ===
                                'INDIVIDUAL'
                                  ? 'Individual'
                                  : 'Group'}
                              </Tag>
                            </Descriptions.Item>

                            {selectedMemberToData?.memberType ===
                            'INDIVIDUAL' ? (
                              <>
                                <Descriptions.Item label='Tel. 1'>
                                  {selectedMemberToData?.phoneNumber}
                                </Descriptions.Item>
                                {selectedMemberToData.phoneNumber2 && (
                                  <Descriptions.Item label='Tel. 2'>
                                    {selectedMemberToData.phoneNumber2}
                                  </Descriptions.Item>
                                )}
                                <Descriptions.Item label='Email'>
                                  {selectedMemberToData?.emailAddress}
                                </Descriptions.Item>
                                <Descriptions.Item label='County'>
                                  {selectedMemberToData?.county}
                                </Descriptions.Item>
                                <Descriptions.Item label='Sub-county'>
                                  {selectedMemberToData?.subCounty}
                                </Descriptions.Item>
                              </>
                            ) : (
                              <>
                                <Descriptions.Item label='Identification No.'>
                                  {
                                    selectedMemberToData?.groupData
                                      .identificationNumber
                                  }
                                </Descriptions.Item>
                                <Descriptions.Item label='Group Name'>
                                  {selectedMemberToData?.groupData.groupName}
                                </Descriptions.Item>
                                <Descriptions.Item label='Group members'>
                                  <Badge
                                    count={
                                      selectedMemberToData?.groupData
                                        ?.groupMembersData.length ?? 0
                                    }
                                    onClick={() =>
                                      groupMembersInfo(
                                        selectedMemberToData?.groupData
                                          ?.groupMembersData
                                      )
                                    }
                                    title='Click to view group members'
                                    style={{
                                      backgroundColor: 'purple',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Tag color='lime'>View members</Tag>
                                  </Badge>
                                </Descriptions.Item>
                                <Descriptions.Item label='Reg. Date'>
                                  {
                                    selectedMemberToData?.groupData
                                      ?.registrationDate
                                  }
                                </Descriptions.Item>
                              </>
                            )}
                          </Descriptions>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Card>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col span={24} className='d-flex justify-content-end'>
              <Button
                type='primary'
                htmlType='submit'
                loading={isSubmitBtnLoading}
                disabled={isBtnDisabled}
              >
                Make Transfer
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

export default NewTransfer;
