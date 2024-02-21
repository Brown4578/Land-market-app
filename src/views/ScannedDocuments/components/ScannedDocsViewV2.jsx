import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  Tag,
  Image,
  Descriptions,
  Spin,
  Space,
} from 'antd';
import './styles.css';
import { scannedDocsService, plotService } from '../../../_services';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Carousel } from 'react-responsive-carousel';

const { Option } = Select;

const ScannedDocsView = () => {
  const navigate = useNavigate();
  const defaultPage = { pageNo: 0, pageSize: 10 };

  const [data, setData] = useState([]);
  const [plotsData, setPlotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(defaultPage);
  const [selectedPlotDetails, setSelectedPlotDetails] = useState(null);
  const [currentScannedDocument, setCurrentScannedDocument] = useState(null);
  const [currentActiveSelection, setCurrentActiveSelection] =
    useState('generalSearch');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    getPlots(searchParams);
  }, [searchParams]);

  const fetchPlotDocScans = async (certNo) => {
    setIsLoading(true);
    setData([]);
    let params = { certNo };
    setCurrentScannedDocument(null);
    try {
      let resp = await scannedDocsService.fetchPlotDocScans(params);

      let content = resp.data.body?.content ?? [];

      setData(content);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const previewScans = async (id) => {
    setSelectedValue(id);
    setIsLoading(true);
    scannedDocsService
      .previewScan(id)
      .then((resp) => {
        let data = resp.data?.body ?? null;
        setCurrentScannedDocument(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getPlots = (params) => {
    params = { ...params, pageNo: 0, pageSize: 10 };
    setPlotsData([]);
    plotService.fetchPlots(params).then((resp) => {
      let body = resp.data.body;
      let content = body?.content ?? [];
      setPlotsData(content);
    });
  };

  const handlePlotChange = (data) => {
    setSelectedValue('');
    if (data) {
      const plotDetails = JSON.parse(data);
      setSelectedPlotDetails(plotDetails);
      if (plotDetails.certificateNumber) {
        fetchPlotDocScans(plotDetails.certificateNumber);
      }
    } else {
      setData([]);
    }
  };

  const handleSpecializedSearch = debounce((value) => {
    switch (currentActiveSelection) {
      case 'generalSearch':
        setSearchParams((prev) => ({
          ...prev,
          term: value || null,
          plotNo: null,
          idNumber: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'plotNo':
        setSearchParams((prev) => ({
          ...prev,
          plotNo: value || null,
          term: null,
          idNumber: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'idNumber':
        setSearchParams((prev) => ({
          ...prev,
          idNumber: value || null,
          plotNo: null,
          term: null,
          certNo: null,
          titleNumber: null,
        }));
        break;
      case 'certNo':
        setSearchParams((prev) => ({
          ...prev,
          certNo: value || null,
          idNumber: null,
          plotNo: null,
          term: null,
          titleNumber: null,
        }));
        break;
      case 'titleNumber':
        setSearchParams((prev) => ({
          ...prev,
          titleNumber: value || null,
          certNo: null,
          idNumber: null,
          plotNo: null,
          term: null,
        }));
        break;

      default:
        break;
    }
  }, 800);

  const selectBefore = (
    <Select
      defaultValue={currentActiveSelection}
      value={currentActiveSelection}
      onChange={(e) => setCurrentActiveSelection(e)}
      dropdownStyle={{ width: '205' }}
      popupMatchSelectWidth={false}
    >
      <Option value='generalSearch' style={{ color: 'rgba(0, 0, 0 ,.5' }}>
        - General Search -
      </Option>
      <Option value='plotNo'>Plot No.</Option>
      <Option value='idNumber'>ID No.</Option>
      <Option value='certNo'>Certificate No.</Option>
      <Option value='titleNumber'>Title No.</Option>
    </Select>
  );

  return (
    <div id='content'>
      <Card
        title='Scanned Documents'
        type='inner'
        extra={
          <>
            <Button
              type='primary'
              size='small'
              onClick={() => navigate('/scanned-documents-new')}
            >
              New Scan
            </Button>
          </>
        }
      >
        <Row gutter={[8, 10]}>
          <Col xxl={8} xl={8} lg={12} md={24} sm={24} xs={24}>
            <Space.Compact block>
              {selectBefore}
              <Select
                showSearch
                placeholder='Select plot'
                allowClear
                onSearch={(e) => handleSpecializedSearch(e)}
                onChange={handlePlotChange}
                optionFilterProp='children'
                style={{ width: '100%' }}
                dropdownStyle={{ width: '265' }}
                popupMatchSelectWidth={false}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={plotsData.map((plot, index) => {
                  return {
                    key: index,
                    value: JSON.stringify(plot),
                    label:
                      index +
                      1 +
                      '. ' +
                      'Cert No: ' +
                      plot.certificateNumber +
                      ' - ' +
                      'Plot No: ' +
                      plot.plotNumber,
                  };
                })}
              />
            </Space.Compact>
          </Col>
          <Col xxl={8} xl={8} lg={12} md={24} sm={24} xs={24}>
            <Select
              style={{ width: '100%' }}
              dropdownStyle={{ width: '205' }}
              popupMatchSelectWidth={false}
              placeholder='Select file location'
              defaultValue={selectedValue}
              value={selectedValue}
              loading={isLoading}
              onChange={(e) => {
                previewScans(e);
              }}
            >
              {data.map((item) => (
                <Option
                  key={item.id}
                  value={item.id}
                >{`File location: ${item?.directoryName}/${item?.fileName}`}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        {isLoading ? (
          <>
            <div
              style={{
                width: '100%',
                height: '100%',
                marginTop: '9%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
              }}
            >
              <Spin />
            </div>
          </>
        ) : (
          <Row gutter={[12, 14]} className='mt-3'>
            <>
              {currentScannedDocument && (
                <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
                  {currentScannedDocument && (
                    <Carousel
                      // onChange={onCarouselChange}
                      useKeyboardArrows={true}
                    >
                      {currentScannedDocument.images.map((item, index) => (
                        <div key={index} style={contentStyle}>
                          <Image
                            src={`data:image/jpeg;base64,${item}`}
                            style={{ width: '100% !important', height: 'auto' }}
                          />
                          <img src={`data:image/jpeg;base64,${item}`} />
                          <p className='legend'>{`Image ${index + 1}.jpg`}</p>
                        </div>
                      ))}
                    </Carousel>
                  )}
                </Col>
              )}
              <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                {selectedPlotDetails && currentScannedDocument && (
                  <Card hoverable>
                    <Descriptions
                      title='Plot Info'
                      extra={
                        <Tag color='green'>
                          Scanned Docs: {currentScannedDocument?.images?.length}
                        </Tag>
                      }
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
                      <Descriptions.Item label='File Location'>
                        {`${currentScannedDocument?.fileLocation} - (${currentScannedDocument?.originalFileName})`}
                      </Descriptions.Item>
                      <Descriptions.Item label='Block Name'>
                        {selectedPlotDetails?.blockName ?? ' -'}
                      </Descriptions.Item>
                      <Descriptions.Item label='Phase Name'>
                        {selectedPlotDetails?.phaseName ?? ' -'}
                      </Descriptions.Item>
                      <Descriptions.Item label='Cert No.'>
                        {selectedPlotDetails?.certificateNumber ?? ' -'}
                      </Descriptions.Item>
                      <Descriptions.Item label='Plot No.'>
                        {selectedPlotDetails?.plotNumber ?? ' -'}
                      </Descriptions.Item>
                      <Descriptions.Item label='Member Name'>
                        {selectedPlotDetails?.memberFullName ||
                          selectedPlotDetails?.memberFirstName ||
                          ' -'}
                      </Descriptions.Item>

                      <Descriptions.Item label='Remarks'>
                        {selectedPlotDetails?.remarks ?? ' -'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}
              </Col>
            </>
          </Row>
        )}
      </Card>
    </div>
  );
};

const contentStyle = {
  height: '380px',
  color: '#fff',
  textAlign: 'center',
  background: '#6995eb',
};

const options = [
  {
    value: 'titleNumber',
    label: 'Title No.',
  },
  {
    value: 'certNo',
    label: 'Cert No.',
  },
  {
    value: 'ballotNo',
    label: 'Ballot No.',
  },
  {
    value: 'idNumber',
    label: 'ID No.',
  },
];

export default ScannedDocsView;
