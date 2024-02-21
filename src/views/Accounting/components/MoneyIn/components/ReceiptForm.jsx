import React from 'react';
import StatementForm from '../../../common/StatementForm';
import { useNavigate } from 'react-router-dom';

const ReceiptForm = () => {
  const navigate = useNavigate();
  return (
    <div id='content'>
      <StatementForm cardTitle='Receive Payment' type="RECEIPT" />
    </div>
  );
};

export default ReceiptForm;
