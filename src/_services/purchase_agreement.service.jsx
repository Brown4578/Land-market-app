import request from '../_helpers/requests';
import { _PURCHASE_AGREEMENT, _TRANSACTION_NUMBER } from '../_helpers/apis';

const fetchPurchaseAgreement = (params) => {
  return request(`${_PURCHASE_AGREEMENT}`, { params });
};
const fetchTransactionNumber = () => {
  return request(`${_TRANSACTION_NUMBER}`);
};

const createPurchaseAgreement = (data) => {
  return request.post(`${_PURCHASE_AGREEMENT}`, data);
};
const updatePurchaseAgreement = (id, data) => {
  return request.put(`${_PURCHASE_AGREEMENT}/${id}`, data);
};

export const purchaseAgreementService = {
  fetchPurchaseAgreement,
  createPurchaseAgreement,
  updatePurchaseAgreement,
  fetchTransactionNumber,
};
