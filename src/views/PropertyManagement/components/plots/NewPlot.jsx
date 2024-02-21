import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Form,
  Input,
  Select,
  Tooltip,
  Radio,
  Tag,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import {
  blockService,
  phaseService,
  plotService,
  memberService,
} from '../../../../_services';
import { debounce } from 'lodash';

const { Option } = Select;

const NewPlot = () => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isNewPlot } = state;

  const [blocks, setBlocks] = useState([]);
  const [phases, setPhases] = useState([]);
  const [members, setMembers] = useState([]);
  const [titleDeeds, setTitleDeeds] = useState([]);
  const [memberType, setMemberType] = useState(null);
  const [isTitleRequired, setIsTitleRequired] = useState(false);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

  useEffect(() => {
    fetchBlocks();
    fetchTitleDeed();
    getMembersDetail();
  }, []);

  useEffect(() => {
    let record = state?.record ?? null;
    if (!isNewPlot && record) {
      if (record?.titleNumber) {
        setIsTitleRequired(true);
      }

      if (record?.blockId) {
        let params = { blockId: record?.blockId };
        fetchPhases(params);
      }
      initializeFormFields(record);
    }
  }, [state]);

  const initializeFormFields = (record) => {
    let titleNumber = record?.titleNumber ?? null;
    if (titleNumber) {
      setIsTitleRequired(true);
    }

    if (record?.blockId) {
      let params = { blockId: record?.blockId };
      fetchPhases(params);
    }

    formRef?.current.setFieldsValue({
      blockId: record?.blockId,
      phaseId: record?.phaseId,
      plotNumber: record?.plotNumber,
      ballotNumber: record?.ballotNumber,
      certificateNumber: record?.certificateNumber,
      fileLocation: record?.fileLocation,
      titleNumber,
      is_title_issued: titleNumber ? true : false,
      remarks: record?.remarks,
    });
  };

  const getMembersDetail = (params) => {
    setMembers([]);
    params = { ...params, pageNo: 0, pageSize: 10 };
    memberService
      .fetchMembers(params)
      .then((resp) => {
        let body = resp.data.body;
        let content = body?.content ?? [];
        setMembers(content);
      })
      .catch((error) => {
        setMembers([]);
      });
  };

  const fetchBlocks = (params) => {
    setBlocks([]);
    blockService.fetchBlocks(params).then((resp) => {
      let content = resp.data?.body ?? [];
      setBlocks(content);
    });
  };

  const fetchPhases = (params) => {
    phaseService.fetchPhases(params).then((resp) => {
      let content = resp.data.body?.content || [];
      setPhases(content);
    });
  };

  const fetchTitleDeed = (params) => {
    setTitleDeeds([
      {
        id: 1,
        blockId: 1,
        phaseId: 1,
        titleNumber: '0001 Test',
      },
      {
        id: 2,
        blockId: 1,
        phaseId: 1,
        titleNumber: '0002 Test',
      },
      {
        id: 3,
        blockId: 1,
        phaseId: 1,
        titleNumber: '0003 Test',
      },
    ]);
  };

  const handleBlockChange = (val) => {
    if (val) {
      let params = { blockId: val };
      fetchPhases(params);
    } else {
      setPhases([]);
      formRef.current?.setFieldsValue({
        phaseId: '',
      });
    }
  };
  const handleTitleStatus = (val) => {
    if (val && val === true) {
      setIsTitleRequired(true);
    } else {
      setIsTitleRequired(false);
    }
  };

  const onFinish = (values) => {
    if (isNewPlot) {
      doSave(values);
    } else {
      doUpdate(values);
    }
  };

  const doSave = (values) => {
    setIsSubmitBtnLoading(true);
    plotService
      .createPlot(values)
      .then((resp) => {
        toast.success('New plot registered successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const doUpdate = (values) => {
    setIsSubmitBtnLoading(true);
    plotService
      .updatePlot(state.record.id, values)
      .then((resp) => {
        toast.success('Plot details updated successfully');
        setIsSubmitBtnLoading(false);
        handleBack();
      })
      .catch(() => {
        setIsSubmitBtnLoading(false);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMemberSearch = debounce((e) => {
    getMembersDetail({ term: e });
  }, 800);

  const handleMemberChange = (e) => {
    if (e) {
      let selectedMember = members.find((member) => member.id === e);
      setMemberType(selectedMember?.memberType ?? null);
    } else {
      setMemberType(null);
    }
  };

  return (
    <Card
      type='inner'
      title={
        <Space>
          <Button
            type='link'
            style={{ width: '15px' }}
            icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
            onClick={() => handleBack()}
          />
          <span>{isNewPlot ? 'Create' : 'Update'} Plot</span>
        </Space>
      }
      extra={
        memberType && (
          <Tag color={memberType === 'INDIVIDUAL' ? '#2db7f5' : '#87d068'}>
            {memberType === 'INDIVIDUAL'
              ? 'Assigning an Individual'
              : 'Assigning a Group'}
          </Tag>
        )
      }
    >
      <Row gutter={[8, 10]}>
        <Col span={24}>
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
                  label='Plot No.'
                  name='plotNumber'
                  rules={[
                    {
                      required: true,
                      message: 'Plot number is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter plot no.' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Ballot No.'
                  name='ballotNumber'
                  rules={[
                    {
                      required: true,
                      message: 'Ballot number is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter ballot no.' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Certificate No.'
                  name='certificateNumber'
                  rules={[
                    {
                      required: true,
                      message: 'Certificate no. is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter certificate no.' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Block No.'
                  name='blockId'
                  rules={[
                    {
                      required: true,
                      message: 'Block no. is required!',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder='Select a block'
                    optionFilterProp='children'
                    onChange={handleBlockChange}
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    dropdownStyle={{
                      minWidth: '340px',
                      width: '100%',
                    }}
                  >
                    {blocks.map((block) => (
                      <Option value={block.id} key={block.id}>
                        <Space>
                          {(block?.blockName &&
                            convertToLowerThenCapitalize(block.blockName)) ||
                            ''}
                          -
                          {(block?.county &&
                            convertToLowerThenCapitalize(block.county)) ||
                            ''}
                          -
                          {(block?.subCounty &&
                            convertToLowerThenCapitalize(block.subCounty)) ||
                            ''}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Phase'
                  name='phaseId'
                  rules={[
                    {
                      required: true,
                      message: 'Phase is required!',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder='Select a phase'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {phases.map((phase) => (
                      <Option value={phase.id} key={phase.id}>
                        <Tooltip
                          title={
                            <>
                              {(phase?.phaseName &&
                                convertToLowerThenCapitalize(
                                  phase.phaseName
                                )) ||
                                ''}
                              {' - '}
                              {phase?.blockName}
                            </>
                          }
                        >
                          <Space>
                            {(phase?.phaseName &&
                              convertToLowerThenCapitalize(phase.phaseName)) ||
                              ''}
                            {' - '}
                            {phase?.blockName}
                          </Space>
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Member'
                  name='memberId'
                  rules={[
                    {
                      required: false,
                      message: 'Member is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder='Select member'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onSearch={handleMemberSearch}
                    onChange={handleMemberChange}
                  >
                    {members.map((member) => (
                      <Option value={member.id} key={member.id}>
                        {member.memberType === 'INDIVIDUAL' ? (
                          <span style={{ color: '#2db7f5' }}>
                            {member.firstName +
                              ' ' +
                              member.secondName +
                              ' ' +
                              member.surname}
                          </span>
                        ) : (
                          <span style={{ color: '#87d068' }}>
                            {member.groupData.identificationNumber +
                              ' - ' +
                              member.groupData.groupName}
                          </span>
                        )}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='File Location'
                  name='fileLocation'
                  rules={[
                    {
                      required: true,
                      message: 'File location is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter file location' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Is Title Issued'
                  name='is_title_issued'
                  rules={[
                    {
                      required: true,
                      message: 'Specify if title is issued or not!',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => handleTitleStatus(e.target.value)}
                  >
                    <Radio value={true} key={'YES'}>
                      Yes
                    </Radio>
                    <Radio value={false} key={'NO'}>
                      No
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Title No.'
                  name='titleNumber'
                  rules={[
                    {
                      required: isTitleRequired,
                      message: 'Title number is required!',
                    },
                  ]}
                >
                  <Input placeholder='Enter title no.' />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='Size'
                  name='size'
                  rules={[
                    {
                      required: true,
                      message: 'Size is required!',
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder='Specify the size'
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
                      message: 'Remarks required!',
                    },
                  ]}
                >
                  <Input.TextArea placeholder='Type your remarks' />
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
                  {isNewPlot ? 'Create Plot' : 'Update Plot'}
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

const convertToLowerThenCapitalize = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word[0]?.toUpperCase() + word.slice(1);
    })
    .join(' ');
};
export default NewPlot;
