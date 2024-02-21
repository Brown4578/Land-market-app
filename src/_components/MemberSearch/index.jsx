import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Radio, Input, Select, Button } from 'antd';
import { memberService } from '../../_services';
import { debounce } from 'lodash';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  groupMemberColumns,
  memberColumns,
} from '../../views/MemberManagement/components/columns';
import { GoPeople } from 'react-icons/go';

const { Option } = Select;
export const MemberSearch = ({
  showMembers = true,
  showGroupMembers = true,
  size = 'default',
  multipleSelection = false,
  useButtonAsComponent = false,
  ...props
}) => {
  const [type, setType] = useState(
    showMembers ? 'Members' : showGroupMembers ? 'GroupMembers' : null
  );

  const start_page = { pageNo: 0, pageSize: 10 };
  const [visible, setVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_elements, setTotalElements] = useState(0);
  const [page, setPage] = useState(start_page);
  const [specializedSearchValue, setSpecializedSearchValue] = useState(null);
  const [value, setValue] = useState(multipleSelection ? [] : '');
  const [searchParams, setSearchParams] = useState(start_page);
  const [disabled, setDisabled] = useState(false);
  const [maxModalSize, setMaxModalSize] = useState(1000);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentActiveSelection, setCurrentActiveSelection] =
    useState('generalSearch');

  const resize = () => {
    const maxSize = Math.min(1000, window.innerWidth);
    setMaxModalSize(maxSize);
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  const columns = type === 'Members' ? memberColumns : groupMemberColumns;

  useEffect(() => {
    if (type === 'Members') getMembers(searchParams, 'INDIVIDUAL');
    if (type === 'GroupMembers') getMembers(searchParams, 'GROUP');
  }, [searchParams, type]);

  useEffect(() => {
    if (props.defaultVal?.length > 0 && multipleSelection) {
      let membersArray = props.defaultVal;
      let membersIds = membersArray.map((member) => member.id);

      setSelectedMembers(membersArray);
      props.member(membersIds);
      setValue(membersIds);
    }
  }, [props.defaultVal]);

  const getMembers = async (data, type) => {
    let params = {
      ...data,
      type,
    };

    setLoading(true);
    setMembers([]);

    try {
      let response = await memberService.fetchMembers(params);
      let data = response.data.body;

      setMembers(data?.content);
      setTotalElements(data.pagination?.totalElements || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = debounce((params) => {
    setSearchParams({ search: params, ...start_page });
    setPage(start_page);
  }, 500);

  const handleTableChange = (value) => {
    let current_page = {
      pageNo: value.current - 1,
      pageSize: 10,
    };
    let params = { ...searchParams, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSearchParams({ ...searchParams, ...start_page });
    setPage(start_page);
  };
  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.member(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleRowClick = (record) => {
    return {
      onClick: (event) => {
        if (multipleSelection) {
          handleMultipleSelection(record);
        } else {
          handleNormalSelection(record);
        }
      },
    };
  };
  const handleNormalSelection = (record) => {
    props.member({
      ...record,
    });
    setValue(record.fullName);
    setDisabled(true);
    handleCloseModal();
  };
  const handleMultipleSelection = (record) => {
    if (!selectedMembers.some((item) => item.id === record?.id)) {
      let newSelectedMembers = [...selectedMembers, record];
      setSelectedMembers(newSelectedMembers);
      let newMemberIds = newSelectedMembers.map((item) => item.id);

      props.member(newMemberIds);

      setValue([...value, record?.id]);
    }

    handleCloseModal();
  };
  const handleCloseModal = () => {
    setVisible(false);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const handleCancel = (e) => {
    setVisible(false);
    setSpecializedSearchValue(null);
  };

  const removeSelectedMember = (memberId) => {
    let filteredMembers = value.filter((item) => item !== memberId);

    setValue(filteredMembers);
    props.member(filteredMembers);
  };

  const handleSelectBeforeChange = (e) => {
    setCurrentActiveSelection(e);
    triggerChangeParams(e);
  };

  const triggerChangeParams = (e) => {
    if (e === 'generalSearch') {
      setSearchParams((prev) => ({
        ...prev,
        term: specializedSearchValue,
        firstName: null,
        secondName: null,
        surname: null,
        idNumber: null,
        phoneNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    } else if (e === 'firstName') {
      setSearchParams((prev) => ({
        ...prev,
        firstName: specializedSearchValue,
        term: null,
        secondName: null,
        surname: null,
        idNumber: null,
        phoneNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    } else if (e === 'secondName') {
      setSearchParams((prev) => ({
        ...prev,
        secondName: specializedSearchValue,
        term: null,
        firstName: null,
        surname: null,
        idNumber: null,
        phoneNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    } else if (e === 'surname') {
      setSearchParams((prev) => ({
        ...prev,
        surname: specializedSearchValue,
        term: null,
        firstName: null,
        secondName: null,
        idNumber: null,
        phoneNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    } else if (e === 'idNumber') {
      setSearchParams((prev) => ({
        ...prev,
        idNumber: specializedSearchValue,
        term: null,
        firstName: null,
        secondName: null,
        surname: null,
        phoneNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    } else if (e === 'phoneNumber') {
      setSearchParams((prev) => ({
        ...prev,
        phoneNumber: specializedSearchValue,
        term: null,
        firstName: null,
        secondName: null,
        surname: null,
        idNumber: null,
        ...start_page,
      }));
      setPage(start_page);
    }
  };
  const selectBefore = (
    <Select
      size='small'
      defaultValue={currentActiveSelection}
      value={currentActiveSelection}
      onChange={(e) => handleSelectBeforeChange(e)}
      dropdownStyle={{ width: '205' }}
      popupMatchSelectWidth={false}
    >
      <Option value='generalSearch' style={{ color: 'rgba(0, 0, 0 ,.5' }}>
        - General Search -
      </Option>
      <Option value='firstName'>First Name</Option>
      <Option value='secondName'>Second Name</Option>
      <Option value='phoneNumber'>Phone Number</Option>
      <Option value='idNumber'>Id Number</Option>
    </Select>
  );

  const handleSpecializedSearch = debounce((e) => {
    let value = e.target?.value || null;
    setSpecializedSearchValue(value);
    switch (currentActiveSelection) {
      case 'generalSearch':
        setSearchParams((prev) => ({
          ...prev,
          term: e.target?.value || null,
          firstName: null,
          secondName: null,
          surname: null,
          idNumber: null,
          phoneNumber: null,

          ...start_page,
        }));
        setPage(start_page);
        break;
      case 'firstName':
        setSearchParams((prev) => ({
          ...prev,
          firstName: e.target?.value || null,
          term: null,
          secondName: null,
          surname: null,
          idNumber: null,
          phoneNumber: null,

          ...start_page,
        }));
        setPage(start_page);
        break;
      case 'secondName':
        setSearchParams((prev) => ({
          ...prev,
          secondName: e.target?.value || null,
          firstName: null,
          term: null,
          surname: null,
          idNumber: null,
          phoneNumber: null,

          ...start_page,
        }));
        setPage(start_page);
        break;
      case 'surname':
        setSearchParams((prev) => ({
          ...prev,
          surname: e.target?.value || null,
          term: null,
          secondName: null,
          firstName: null,
          idNumber: null,
          phoneNumber: null,

          ...start_page,
        }));
        setPage(start_page);
        break;
      case 'idNumber':
        setSearchParams((prev) => ({
          ...prev,
          idNumber: e.target?.value || null,
          term: null,
          secondName: null,
          surname: null,
          firstName: null,
          phoneNumber: null,

          ...start_page,
        }));
        setPage(start_page);
        break;
      case 'phoneNumber':
        setSearchParams((prev) => ({
          ...prev,
          phoneNumber: e.target?.value || null,
          term: null,
          secondName: null,
          surname: null,
          firstName: null,
          idNumber: null,
          ...start_page,
        }));
        setPage(start_page);
        break;

      default:
        break;
    }
  }, 800);

  return (
    <>
      {multipleSelection ? (
        <div>
          <Select
            size={size}
            value={value}
            placeholder={'Search Member'}
            onClick={showModal}
            disabled={disabled}
            mode='multiple'
            onDeselect={removeSelectedMember}
            options={selectedMembers?.map((member) => {
              return {
                value: member.id,
                label: member.fullName,
              };
            })}
          />
        </div>
      ) : useButtonAsComponent ? (
        <Button
          onClick={showModal}
          style={{ width: '100%' }}
          icon={<GoPeople color='purple' />}
        >
          Register
        </Button>
      ) : (
        <Input
          size={size}
          value={value}
          suffix={<SearchOutlined />}
          addonAfter={<DeleteOutlined onClick={handleClear} />}
          placeholder={'Search member'}
          onClick={showModal}
          disabled={disabled}
        />
      )}
      <Modal
        afterClose={handleCancel}
        destroyOnClose={true}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={maxModalSize}
        style={{ top: '10px' }}
      >
        <Row>
          <Col lg={15} md={15} sm={11} xs={24}>
            <Radio.Group value={type} onChange={handleTypeChange}>
              {showMembers && (
                <Radio key='1' value='Members'>
                  Members
                </Radio>
              )}

              {/* {showGroupMembers && (
                <Radio key='3' value='GroupMembers'>
                  Group Members
                </Radio>
              )} */}
            </Radio.Group>
          </Col>
          <Col xl={7} lg={7} md={7} sm={12} xs={24}>
            <Input
              size='small'
              addonBefore={selectBefore}
              allowClear
              onChange={(e) => handleSpecializedSearch(e)}
            />
          </Col>
        </Row>
        <br />
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={members}
          pagination={
            // type === 'ActivePatients'
            //   ? false
            //   :
            { current: page.pageNo + 1, pageSize: 10, total: total_elements }
          }
          onChange={handleTableChange}
          size='small'
          bordered
          onRow={handleRowClick}
          // rowKey={(data) => data.key}
          rowKey={(data) => data.id}
        />
      </Modal>
    </>
  );
};
