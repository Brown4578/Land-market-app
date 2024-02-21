import React from 'react'
import StatementForm from '../../../common/StatementForm';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  return (
    <div id='content'>
      <StatementForm cardTitle="Make Payment" type="PAYMENT"/>
    </div>
  );
}

export default PaymentForm