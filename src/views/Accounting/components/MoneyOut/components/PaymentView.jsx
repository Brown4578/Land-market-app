import React from 'react';
import { Card, Button } from 'antd';
import StatementView from '../../../common/StatementView';
import { useNavigate } from 'react-router-dom';

const PaymentView = (props) => {
  const navigate = useNavigate();
  return (
    <div id='content'>
      <Card
        type='inner'
        title='Payments'
        extra={
          <Button
            size='small'
            type='primary'
            onClick={() => navigate('/accounting/payment/new')}
          >
            Make Payment
          </Button>
        }
      >
        <StatementView
          type='PAYMENT'
          activityType='Refund, MarketerPayment, NonMemberPayment'
        />
      </Card>
    </div>
  );
};

export default PaymentView;
