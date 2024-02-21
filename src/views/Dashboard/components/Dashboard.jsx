import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import { CardView } from './CardView';
import { dashboardService } from '../../../_services';
import { CustomBarGraph } from './CustomBarGraph';
import { SalesPerMonthView } from './SalesPerMonthView';
import { convertToLowerThenCapitalize } from '../../../_helpers/utils/StringManipulator';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState(null);
  const [topMarketersData, setTopMarketersData] = useState([]);
  const [salesPerMonthData, setSalesPerMonthData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    getGraphsData();
  }, []);

  const fetchDashboardData = () => {
    setIsLoading(true);
    dashboardService
      .fetchDashboardData()
      .then((resp) => {
        const respData = resp.data?.body || null;
        setData(respData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getGraphsData = () => {
    setIsFetching(true);
    dashboardService
      .getGraphsData()
      .then((resp) => {
        const content = resp.data?.body || [];

        if (content.length > 0) {
          const TOP_10_MARKETERS = content.filter(
            (item) => item.graphName === 'TOP_10_MARKETERS'
          );
          const SALES_PER_MONTH = content.filter(
            (item) => item.graphName === 'SALES_PER_MONTH'
          );

          if (TOP_10_MARKETERS.length > 0) {
            const reportData = TOP_10_MARKETERS[0].reportData.map((item) => {
              return {
                ...item,
                value: item.value ? Number(parseFloat(item.value)) : 0,
                label: String(convertToLowerThenCapitalize(item.label)),
              };
            });
            setTopMarketersData(reportData);
          }
          if (SALES_PER_MONTH.length > 0) {
            const reportData = SALES_PER_MONTH[0].reportData.map((item) => {
              return {
                ...item,
                value: item.value ? Number(parseFloat(item.value)) : 0,
                label: String(convertToLowerThenCapitalize(item.label)),
              };
            });
            setSalesPerMonthData(reportData);
          }

          setIsFetching(false);
        } else {
          setTopMarketersData([]);
          setSalesPerMonthData([]);
          setIsFetching(false);
        }
      })
      .catch((err) => {
        setTopMarketersData([]);
        setSalesPerMonthData([]);
        setIsFetching(false);
      });
  };

  return (
    <Card
      id='content'
      title='Dashboard'
      size='small'
      style={{ height: '100vh' }}
    >
      <Row gutter={[11, 12]}>
        <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
          <CardView
            title='Number of Sales'
            value={data && data.numberOfSales}
            hasPrefix={false}
            loading={isLoading}
            hadPrecision={false}
          />
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
          <CardView
            title='Total Sales Amount'
            value={data && data.totalSalesAmount}
            hasPrefix={true}
            loading={isLoading}
          />
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
          <CardView
            title='Running Balances'
            value={data && data.runningBalances}
            hasPrefix={true}
            loading={isLoading}
          />
        </Col>
        <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
          <CardView
            title='Available Units'
            value={data && data.availableUnits}
            hasPrefix={false}
            loading={isLoading}
            hadPrecision={false}
          />
        </Col>

        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          {/* <SalesPerMonthView loading={isFetching} data={salesPerMonthData} /> */}
          <CustomBarGraph
            title='Sales per Month'
            loading={isFetching}
            data={salesPerMonthData}
          />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <CustomBarGraph
            title='Top 10 Marketers'
            loading={isFetching}
            data={topMarketersData}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Dashboard;
