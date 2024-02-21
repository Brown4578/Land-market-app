import request from '../_helpers/requests';
import { transactionType } from '../_helpers/apis';

const fetchTransactionType = () => {
  return request(transactionType);
};
const createTransactionType = (values) => {
  return request.post(transactionType, values);
};
const editTransactionType = (code, values) => {
  return request.put(`${transactionType}/${code}`, values);
};

export const TransactionService = {
  fetchTransactionType,
  createTransactionType,
  editTransactionType,
};
