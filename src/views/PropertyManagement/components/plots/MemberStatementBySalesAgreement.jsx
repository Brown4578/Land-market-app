import React from 'react';
import { Card, Button, Space } from 'antd';
import StatementView from '../../../Accounting/common/StatementView';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const MemberStatementBySalesAgreement = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate(-1);
  };

  return (
    <div id='content'>
      <Card
        type='inner'
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => handleBackToList()}
            />
            <span>Member Statement(s)</span>
          </Space>
        }
      >
        {state && state.data && (
          <StatementView
            activityType='MemberReceipt'
            salesAgreementId={state.data.id}
            showActions={false}
            agreementNo={state.data.agreementNumber}
          />
        )}
      </Card>
    </div>
  );
};

export default MemberStatementBySalesAgreement;
