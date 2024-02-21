import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Radio, Input, Select } from 'antd';
import { blockService, phaseService, plotService } from '../../_services';
import { debounce, set } from 'lodash';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { propertySearchColumns } from '../../views/PropertySearch/components/columns';
import styled from 'styled-components';
import { convertToLowerThenCapitalize } from '../../_helpers/utils/StringManipulator';

export const PlotSearch = ({
  showMembers = true,
  showPlots = true,
  size = 'default',
  multipleSelection = false,
  showUnAllocatedOnly = false,
  defaultPropertyParams = null,
  clear = false,
  ...props
}) => {
  const [type, setType] = useState('Plots');
  const start_page = { pageNo: 0, pageSize: 10 };
  const [visible, setVisible] = useState(false);
  const [plots, setPlots] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_elements, setTotalElements] = useState(0);
  const [page, setPage] = useState(start_page);
  const [search, setSearch] = useState(null);
  const [value, setValue] = useState(multipleSelection ? [] : '');
  const [searchParams, setSearchParams] = useState(
    defaultPropertyParams ? defaultPropertyParams : start_page
  );
  const [disabled, setDisabled] = useState(false);
  const [maxModalSize, setMaxModalSize] = useState(1000);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);

  const resize = () => {
    const maxSize = Math.min(1000, window.innerWidth);
    setMaxModalSize(maxSize);
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  });

  useEffect(() => {
    if (multipleSelection) {
      setValue([]);
      setSelectedPlot([]);
      props.plot([]);
    }
  }, [clear]);

  const columns = [...propertySearchColumns];

  useEffect(() => {
    if (props?.defaultVal?.length > 0 && multipleSelection) {
      let propertyArray = props.defaultVal;
      let propertyIds = propertyArray.map((property) => property.id);

      setSelectedPlot(propertyArray);
      props.plot(propertyIds);
      setValue(propertyIds);
    }
  }, [props.defaultVal]);

  useEffect(() => {
    if (type === 'Plots') {
      getPlots(searchParams);
    }
  }, [searchParams, type, defaultPropertyParams]);

  useEffect(() => {
    fetchBlocks();
    fetchPhases();
  }, []);

  const getPlots = async (data) => {
    const previousParams = defaultPropertyParams ? defaultPropertyParams : {};
    let params = {
      ...data,
      ...previousParams,
      term: data.search,
      allocated: showUnAllocatedOnly ? false : null,
    };

    setLoading(true);
    setPlots([]);

    try {
      let response = await plotService.fetchPlots(params);
      let data = response.data.body;
      let pagination = data?.pagination ?? null;

      setPlots(data?.content);
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
  const fetchBlocks = (params) => {
    setBlocks([]);
    setPhases([]);
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
  const handleBlockChange = (val) => {
    if (val) {
      setSearchParams((prev) => ({ ...prev, blockId: val, phaseId: null }));
      fetchPhases({ blockId: val });
    } else {
      setSearchParams((prev) => ({ ...prev, blockId: null, phaseId: null }));
    }
    setSelectedPhase(null);
  };

  const handlePhaseChange = (val) => {
    let phase;
    if (val) {
      phase = JSON.parse(val);
      setSearchParams((prev) => ({ ...prev, phaseId: phase.id }));
      setSelectedPhase(convertToLowerThenCapitalize(phase.phaseName));
    } else {
      setSearchParams((prev) => ({ ...prev, phaseId: null }));
      setSelectedPhase(null);
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSearchParams({ search, ...start_page });
    setPage(start_page);
  };
  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.plot(null);
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
    if (!selectedPlot.some((item) => item.id === record.id)) {
      let newSelectedPlots = [...selectedPlot, record];
      setSelectedPlot(newSelectedPlots);
      let newPlotIds = newSelectedPlots.map((item) => item.id);

      props.plot(newPlotIds);

      setValue([...value, record?.id]);
    }

    handleCloseModal();
  };

  const handleNormalSelection = (record) => {
    props.plot({
      ...record,
    });

    setValue(
      record.plotNumber +
        ' - ' +
        record.titleNumber +
        ' - ' +
        record.certificateNumber
    );
    setDisabled(true);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setVisible(false);
    setSearchParams(start_page);
    setSearch(null);
    setPage(start_page);
    setSelectedPhase(null);
  };

  const removeSelectedPlot = (plotId) => {
    let selectedPlots = value.filter((item) => item !== plotId);
    setValue(selectedPlots);
    setSelectedPlot(selectedPlot.filter((item) => item.id !== plotId));
    props.plot(selectedPlots);
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
          <StyledSelect
            size={size}
            value={value}
            placeholder={'Search plot'}
            onClick={showModal}
            disabled={!defaultPropertyParams?.phaseId}
            mode='multiple'
            onDeselect={removeSelectedPlot}
            options={selectedPlot?.map((plot) => {
              return {
                value: plot.id,
                label: `${plot?.plotNumber || plot?.blockName} -${
                  plot?.titleNumber || plot?.phaseName
                } -${plot?.certificateNumber || plot?.propertyNumber}`,
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
          placeholder={'Search plot'}
          onClick={showModal}
          disabled={disabled}
        />
      )}
      <Modal
        afterClose={handleCloseModal}
        destroyOnClose={true}
        open={visible}
        onCancel={handleCloseModal}
        footer={null}
        width={maxModalSize}
        style={{ top: '10px' }}
      >
        <Row gutter={12}>
          <Col span={!defaultPropertyParams ? 4 : 16}>
            <Radio.Group value={type} onChange={handleTypeChange}>
              {showPlots && (
                <Radio key='3' value='Plots'>
                  Plots
                </Radio>
              )}
            </Radio.Group>
          </Col>
          {!defaultPropertyParams && (
            <>
              <Col span={7}>
                <Select
                  size='small'
                  showSearch
                  allowClear
                  placeholder='Select a block'
                  optionFilterProp='children'
                  onChange={handleBlockChange}
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.searchLabel ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={blocks.map((block) => {
                    return {
                      value: block.id,
                      searchLabel: block?.blockName,

                      label: (
                        <>
                          {(block?.blockName &&
                            convertToLowerThenCapitalize(block.blockName)) ||
                            ''}
                          {` - `}
                          {(block?.county &&
                            convertToLowerThenCapitalize(block.county)) ||
                            ''}
                          {` - `}
                          {(block?.subCounty &&
                            convertToLowerThenCapitalize(block.subCounty)) ||
                            ''}
                        </>
                      ),
                    };
                  })}
                />
              </Col>
              <Col span={6}>
                <Select
                  value={selectedPhase}
                  size='small'
                  showSearch
                  allowClear
                  placeholder='Select phase'
                  optionFilterProp='children'
                  onChange={handlePhaseChange}
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.searchLabel ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={phases.map((phase) => {
                    return {
                      value: JSON.stringify(phase),
                      searchLabel: phase?.phaseName,
                      label: (
                        <>
                          <>
                            {(phase?.phaseName &&
                              convertToLowerThenCapitalize(phase.phaseName)) ||
                              ''}
                          </>
                        </>
                      ),
                    };
                  })}
                />
              </Col>
            </>
          )}
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
          dataSource={plots}
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

const StyledSelect = styled(Select)`
  .ant-select-dropdown {
    display: none !important;
  }
`;
