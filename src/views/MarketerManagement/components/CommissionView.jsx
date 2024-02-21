import React, { useEffect, useState } from 'react';
import { commissionService } from '../../../_services';
import { Card, Col, Row, Table, Button, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { commissionColumns } from './columns';
import { MarketerSearch } from '../../../_components/MarketerSearch';
import { SalesAgreementSearch } from '../../../_components/SalesAgreementSearch';
import { CSVLink } from 'react-csv';
import { RiFileExcel2Fill } from 'react-icons/ri';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const CommissionView = () => {
  const navigate = useNavigate();

  const defaultPage = { pageNo: 0, pageSize: 10 };
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(defaultPage);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState({
    ...defaultPage,
  });

  const columns = [...commissionColumns];

  useEffect(() => {
    fetchCommissions(searchParams);
  }, [searchParams]);

  const fetchCommissions = (params) => {
    setIsLoading(true);
    commissionService
      .fetchCommissions(params)
      .then((resp) => {
        const respBody = resp.data.body;
        setDataSource(respBody?.content || []);
        setTotalElements(respBody.pagination?.totalElements || 0);
        
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const handleTableChange = (value) => {
    let current_page = {
      pageNo: value.current - 1,
      pageSize: 10,
    };
    let params = { search, ...current_page };

    setSearchParams(params);
    setPage(current_page);
  };

  const handleRange = (data) => {
    if (data && !data.length < 1) {
      let date = `${data[0].format(dateFormat)}..${data[1].format(dateFormat)}`;

      let params = {
        ...searchParams,
        dateRange: date,
      };
      setSearchParams(params);
    } else {
      let params = {
        ...searchParams,
        dateRange: null,
      };
      setSearchParams(params);
    }
  };

  const selectMarketer = (data) => {
    if (data) {
      setSearchParams((prev) => ({ ...prev, marketerId: data.id }));
    } else {
      setSearchParams((prev) => ({ ...prev, marketerId: null }));
    }
  };

  const selectAgreement = (data) => {
    if (data) {
      setSearchParams((prev) => ({
        ...prev,
        agreementNumber: data.agreementNumber,
      }));
    } else {
      setSearchParams((prev) => ({ ...prev, agreementNumber: null }));
    }
  };

  const titleHeader = (
    <Row gutter={[10, 12]}>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
        <MarketerSearch marketer={selectMarketer} />
      </Col>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
        <SalesAgreementSearch agreement={selectAgreement} />
      </Col>
      <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24}>
        <RangePicker
          placeholder={['Start Date', 'End Date']}
          onChange={handleRange}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  );

  return (
    <div id='content'>
      <Card title='Commissions'>
        <Row gutter={[8, 12]}>
          <Col span={24}>
            <Table
              title={() => titleHeader}
              footer={() => (
                <CSVLink
                  filename={`Commission report.csv`}
                  data={dataSource.map((item) => {
                    const { saleId, marketerId, ...rest } = item;
                    return rest;
                  })}
                >
                  {' '}
                  <RiFileExcel2Fill color='#117d42' />
                  Export CSV
                </CSVLink>
              )}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: page.pageNo + 1,
                pageSize: page.pageSize,
                total: totalElements,
              }}
              size='small'
              loading={isLoading}
              rowKey={(record) => Math.random()}
              onChange={handleTableChange}
              scroll={{ x: '1200px' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CommissionView;
