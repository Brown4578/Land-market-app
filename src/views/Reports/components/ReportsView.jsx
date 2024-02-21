import { Card, Col, Radio, Row } from 'antd';
import React from 'react';
const ReportsView = () => {
  let ReportsList = [
    {
      title: 'Business Overview',
      children: [
        {
          title: 'Daily Income Statement',
          key: 'daily-income-statement',
        },
        {
          title: 'Sales Detailed Report',
          key: 'sales-detailed-report',
        },
        {
          title: 'Sales Summary Report',
          key: 'sales-summary-report',
        },
      ],
    },
    {
      title: 'Property Reports',
      children: [
        {
          title: 'Plots Listing',
          key: 'plots-listing',
        },
        {
          title: 'Plots Allocation Summary',
          key: 'plots-allocation-summary',
        },
        {
          title: 'Plots Title Issuing Summary',
          key: 'plots-title-issuing-summary',
        },
      ],
    },
    {
      title: 'Member Reports',
      children: [
        {
          title: 'Members Register',
          key: 'members-register',
        },
        {
          title: 'Member Statement',
          key: 'member-statement',
        },
        {
          title: 'Members Individual Account Balances',
          key: 'members-individual-account-balances',
        },
      ],
    },
    {
      title: 'Marketing Reports',
      children: [
        {
          title: 'Sales Agreement By Marketer',
          key: 'sales-agreement-by-marketer',
        },
        {
          title: 'Marketers Summary Report',
          key: 'sales-detailed-report',
        },
      ],
    },
  ];

  return (
    <div id='content'>
      <Card id='cardContent' title={'Reports'}>
        <Row gutter={(24, 24)}>
          {ReportsList.map((report, index) => (
            <Col key={index} lg={6} md={12} sm={24} xs={24}>
              <Card
                type='inner'
                size='small'
                id='cardContent'
                title={report.title}
              >
                {report.children.map((child) => (
                  <Radio
                    style={{ fontSize: '20px' }}
                    value={null}
                    checked={null}
                  >
                    <span style={{ fontSize: '12px' }}>
                      <a href='#'>{child.title}</a>
                    </span>
                  </Radio>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ReportsView;
