import React from 'react';
import { Card, Button } from 'antd';
import StatementView from '../../../common/StatementView';
import { useNavigate } from 'react-router-dom';

const ReceiptView = (props) => {
  const navigate = useNavigate();
  return (
    <div id='content'>
      <Card
        type='inner'
        title='Receipts'
        extra={
          <Button
            size='small'
            type='primary'
            onClick={()=>navigate('/accounting/receipt/new')}
          >
            Receive Payment
          </Button>
        }
      >
        <StatementView activityType='MemberReceipt, NonMemberReceipt' />
      </Card>
    </div>
  );
};

export default ReceiptView;
