import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Radio, Input } from 'antd';
import { purchaseAgreementService } from '../../_services';
import { debounce } from 'lodash';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { minifiedPurchaseAgreementColumns } from '../../views/PropertyManagement/components/plots/columns';

export const SalesAgreementSearch = ({
  showSalesAgreements = true,
  size = 'default',
  ...props
}) => {
  const [type, setType] = useState('SalesAgreement');

  const start_page = { pageNo: 0, pageSize: 10 };
  const [visible, setVisible] = useState(false);
  const [salesAgreements, setSalesAgreements] = useState([]);
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

  const columns = [...minifiedPurchaseAgreementColumns];

  // useEffect(() => {
  //   if (props.patientNo) {
  //     findActiveVisitByPatientNumber(props.patientNo);
  //   }
  // }, [props.patientNo]);

  useEffect(() => {
    if (type === 'SalesAgreement') getPlots(searchParams);
  }, [searchParams, type]);

  // useEffect(() => {
  //   if (props.transfer_data !== null && props.transfer_data !== undefined) {
  //     props.transfer_data.transfer_data
  //       ? setDisabled(true)
  //       : setDisabled(false);
  //     return props.transfer_data.transfer_data
  //       ? setValue(props.transfer_data.transfer_data.patient_name)
  //       : setValue('');
  //   }
  // }, [props.transfer_data]);

  const getPlots = async (data, type) => {
    let params = {
      ...data,
      term: data.search,
    };

    setLoading(true);
    setSalesAgreements([]);

    try {
      let response = await purchaseAgreementService.fetchPurchaseAgreement(
        params
      );
      let data = response.data.body;

      setSalesAgreements(data?.content);
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

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSearchParams({ search, ...start_page });
    setPage(start_page);
  };
  const handleClear = (params) => {
    setValue(null);
    setDisabled(false);
    props.agreement(null);
    setSearchParams(start_page);
    setPage(start_page);
  };

  const showModal = () => {
    setVisible(true);
  };

  // const findActiveVisitByPatientNumber = (patientNo) => {
  //   if (patientNo) {
  //     visitService
  //       .fetchActiveVisitByPatient(patientNo)
  //       .then((resp) => {
  //         let respData = resp.data?.content || null;

  //         let newData = {
  //           patient_id: respData.patient_data?.id,
  //           patient_name: respData.patient_name,
  //           patient_number: respData.patient_data?.patient_number,
  //           phone_number: respData.patient_data?.phone,
  //           national_id: respData.patient_data?.national_id_number,
  //           visit_number: respData.visit_number,
  //           visit_type: respData.visit_type,
  //           key: respData.patient_data?.patient_number,
  //           gender: respData.patient_data?.gender,
  //           given_name: respData.patient_data?.given_name,
  //           middle_name: respData.patient_data?.middle_name,
  //           surname: respData.patient_data?.surname,
  //           practitioner_name: respData.practitioner_name,
  //           payment_method: respData.payment_method,
  //           age_in_years_and_months:
  //             respData.patient_data?.age_in_years_and_months,
  //           age: respData.patient_data?.age,
  //           patient_type: respData.patient_data?.patient === true && 'Patient',
  //           isWalkIn: false,
  //         };

  //         props.agreement({
  //           ...newData,
  //           isWalkIn: type === 'WalkIn' ? true : false,
  //         });
  //         setValue(newData.patient_name);
  //         setDisabled(true);
  //         setVisible(false);
  //         setSearchParams(start_page);
  //         setSearch(null);
  //         setPage(start_page);
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  const handleRowClick = (record) => {
    return {
      onClick: (event) => {
        props.agreement({
          ...record,
        });
        setValue(record.agreementNumber);
        setDisabled(true);
        setVisible(false);
        setSearchParams(start_page);
        setSearch(null);
        setPage(start_page);
      },
    };
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  return (
    <>
      <Input
        size={size}
        value={value}
        suffix={<SearchOutlined />}
        addonAfter={<DeleteOutlined onClick={handleClear} />}
        placeholder={"Search sale's agreement"}
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
            <Radio.Group value={type} onChange={handleTypeChange}>
              {showSalesAgreements && (
                <Radio key='3' value='SalesAgreement'>
                  Sales Agreement
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
          dataSource={salesAgreements}
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
