import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Radio, Input } from 'antd';
import { accountingService } from '../../_services';
import { debounce, set } from 'lodash';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { accountsSearchColumns } from './columns';

export const AccountsSearch = ({
  size = 'default',
  multipleSelection = false,
  ...props
}) => {
  const start_page = { pageNo: 0, pageSize: 10 };
  const [visible, setVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_elements, setTotalElements] = useState(0);
  const [page, setPage] = useState(start_page);
  const [search, setSearch] = useState(null);
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useState(start_page);
  const [disabled, setDisabled] = useState(false);
  const [maxModalSize, setMaxModalSize] = useState(1000);

  const resize = () => {
    const maxSize = Math.min(1000, window.innerWidth);
    setMaxModalSize(maxSize);
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  const columns = [...accountsSearchColumns];

  useEffect(() => {
    getAccounts(searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (props?.defaultAccountValue) {
      setValue(props?.defaultAccountValue?.name);
      setDisabled(props?.defaultAccountValue?.id ? true : false);
    }
  }, [props?.defaultAccountValue]);

  const getAccounts = async (data) => {
    let params = {
      ...data,
      state: 'OPEN, NOT_TRANSACTED',
    };

    setLoading(true);
    setAccounts([]);

    try {
      let response = await accountingService.fetchAccounts(params);
      let data = response.data.body?.content || [];

      setAccounts(data);
      setTotalElements(pagination?.totalElements || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = debounce((params) => {
    let searchTerm = !params || params === '' ? null : params;
    setSearchParams({ term: searchTerm, ...start_page });
    setSearch(params);
    setPage(start_page);
  }, 500);

  const handleTableChange = (value) => {
    let current_page = {
      pageNo: value.current - 1,
      page: value.current - 1,
      pageSize: 10,
    };
    let params = { search, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.account(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        handleNormalSelection(record);
      },
    };
  };

  const handleNormalSelection = (record) => {
    props.account({
      ...record,
    });

    setValue(`${record?.name}`);
    setDisabled(true);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setVisible(false);
    setSearchParams(start_page);
    setSearch(null);
    setPage(start_page);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  return (
    <>
      <Input
        defaultValue={props?.defaultAccountValue?.name}
        size={size}
        value={value}
        suffix={<SearchOutlined />}
        addonAfter={<DeleteOutlined onClick={handleClear} />}
        placeholder={'Search Account'}
        onClick={showModal}
        disabled={disabled}
      />

      <Modal
        destroyOnClose={true}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={maxModalSize}
        style={{ top: '10px' }}
      >
        <Row>
          <Col span={16}>
            <Radio.Group defaultValue={'Accounts'}>
              <Radio key='3' value='Accounts'>
                Accounts
              </Radio>
            </Radio.Group>
          </Col>
          <Col span={6}>
            <Input
              allowClear
              size='small'
              suffix={<SearchOutlined />}
              placeholder={'Search...'}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>
        <br />
        <Table
          loading={isLoading}
          columns={accountsSearchColumns}
          dataSource={accounts}
          pagination={{
            current: page.pageNo + 1,
            pageSize: page.pageSize,
            total: total_elements,
          }}
          onChange={handleTableChange}
          size='small'
          bordered
          onRow={handleRowClick}
          rowKey={(data) => data.id}
        />
      </Modal>
    </>
  );
};
