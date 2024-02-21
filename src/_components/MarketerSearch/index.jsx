import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Radio, Input, Select } from 'antd';
import { plotService } from '../../_services';
import { debounce } from 'lodash';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { marketerSearchColumns } from './columns';
import { marketerService } from '../../_services/marketer.service';

export const MarketerSearch = ({
  showMarketers = true,
  size = 'default',
  multipleSelection = false,
  ...props
}) => {
  const start_page = { pageNo: 0, pageSize: 10 };
  const [visible, setVisible] = useState(false);
  const [marketers, setMarketers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_elements, setTotalElements] = useState(0);
  const [page, setPage] = useState(start_page);
  const [search, setSearch] = useState(null);
  const [value, setValue] = useState(multipleSelection ? [] : '');
  const [searchParams, setSearchParams] = useState(start_page);
  const [disabled, setDisabled] = useState(false);
  const [maxModalSize, setMaxModalSize] = useState(1000);
  const [selectedMarketer, setSelectedMarketer] = useState([]);

  const resize = () => {
    const maxSize = Math.min(1000, window.innerWidth);
    setMaxModalSize(maxSize);
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  const columns = [...marketerSearchColumns];

  useEffect(() => {
    getMarketers(searchParams);
  }, [searchParams]);

  const getMarketers = async (data) => {
    let params = {
      ...data,
      term: data.search,
    };

    setLoading(true);
    setMarketers([]);

    try {
      let response = await marketerService.fetchMarketers(params);
      let data = response.data.body;

      setMarketers(data);
      setTotalElements(pagination?.totalElements || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = debounce((params) => {
    setSearchParams({ search: params, ...start_page });
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
    props.marketer(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        if (!multipleSelection) {
          handleNormalSelection(record);
        } else {
          handleMultipleSelection(record);
        }
      },
    };
  };

  const handleMultipleSelection = (record) => {
    if (!selectedMarketer.some((item) => item.id === record.id)) {
      let newSelectedMarketers = [...selectedMarketer, record];
      setSelectedMarketer(newSelectedMarketers);
      let newMarketerId = newSelectedMarketers.map((item) => item.id);

      props.marketer(newMarketerId);

      setValue([...value, record?.id]);
    }

    handleCloseModal();
  };

  const handleNormalSelection = (record) => {
    props.marketer({
      ...record,
    });

    setValue(
      `${record?.firstName || ''} ${record?.otherNames || ''} ${
        record?.surname || ''
      }`
    );
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

  const removeSelectedMarketer = (plotId) => {
    let selectedMarketers = value.filter((item) => item !== plotId);

    setValue(selectedMarketers);
    props.marketer(selectedMarketers);
  };

  return (
    <>
      {multipleSelection ? (
        <div>
          {/* <style>
            {`
            .ant-select-dropdown {
             display: none; 
}
            `}
          </style> */}
          <Select
            size={size}
            value={value}
            placeholder={'Search marketer'}
            onClick={showModal}
            disabled={disabled}
            mode='multiple'
            onDeselect={removeSelectedMarketer}
            options={selectedMarketer?.map((marketer) => {
              return {
                value: marketer.id,
                label: marketer.fullName,
              };
            })}
          />
        </div>
      ) : (
        <Input
          size={size}
          value={value}
          suffix={<SearchOutlined />}
          addonAfter={<DeleteOutlined onClick={handleClear} />}
          placeholder={'Search marketer'}
          onClick={showModal}
          disabled={disabled}
        />
      )}
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
            <Radio.Group defaultValue={'Marketers'}>
              {showMarketers && (
                <Radio key='3' value='Marketers'>
                  Marketers
                </Radio>
              )}
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
          columns={columns}
          dataSource={marketers}
          pagination={{
            current: page.pageNo + 1,
            pageSize: page.pageSize,
            total: total_elements,
          }}
          onChange={handleTableChange}
          size='small'
          bordered
          onRow={handleRowClick}
          rowKey={(data) => Math.random()}
        />
      </Modal>
    </>
  );
};
