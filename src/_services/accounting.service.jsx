import request from '../_helpers/requests';
import {
  _RECEIPTS,
  _PAYMENTS,
  //New
  _ACCOUNT_URL,
  _CHART_OF_ACCOUNTS_URL,
  _CHART_OF_ACCOUNTS_URL_V2,
  _TRIAL_BALANCE,
  _INCOME_STATEMENT,
  _BALANCE_SHEET,
  _FINANCIAL_YEAR,
  _ACCOUNT_URL_V2,
  _BANKS,
} from '../_helpers/apis';

const fetchReceipts = (params) => {
  return request(_RECEIPTS, { params });
};

const createReceipt = (data) => {
  return request.post(_RECEIPTS, data);
};

const updateReceipt = (id, data) => {
  return request.put(`${_RECEIPTS}/${id}`, data);
};

const deleteStatement = (id) => {
  return request.delete(`${_RECEIPTS}/${id}/delete`);
};

const fetchPayments = (params) => {
  return request(_PAYMENTS, { params });
};

const createPayment = (data) => {
  return request.post(_PAYMENTS, data);
};

const updatePayment = (id, data) => {
  return request.put(`${_PAYMENTS}/${id}`, data);
};

//New URLs
const fetchAccounts = (params) => {
  return request(_ACCOUNT_URL, { params });
};

const getChartsOfAccounts = () => {
  return request(_CHART_OF_ACCOUNTS_URL);
};

const getFinancialYears = () => {
  return request(_FINANCIAL_YEAR);
};

const createAccount = (data) => {
  return request.post(_ACCOUNT_URL, data);
};

const createAccountV2 = (data) => {
  return request.post(_ACCOUNT_URL_V2, data);
};
//FIXME: Duplication and WRONG
const getAccounts = (params) => {
  return request(_ACCOUNT_URL, params);
};

const getAccount = (id) => {
  return request(`${_ACCOUNT_URL}/${id}`);
};
const getLiteAccount = (params) => {
  return request(`${_ACCOUNT_URL}/lite`, { params });
};

const updateAccount = (code, data) => {
  return request.put(`${_ACCOUNT_URL}/${code}`, data);
};

const getIncomeExpenseAccounts = () => {
  return request.get(_ACCOUNT_URL + '/income-expenses');
};

const getAccountEntries = (id, params) => {
  return request(`${_ACCOUNT_URL}/${id}/entries`, { params });
};
const getAccountsInterface = (params) => {
  return request(`${_ACCOUNT_URL}-interface`, { params });
};

const getAccountsInterfaceByName = (accountInterfaceName) => {
  return request(`${_ACCOUNT_URL}-interface/${accountInterfaceName}`);
};
const updateAccountInterface = (params) => {
  return request.put(`${_ACCOUNT_URL}-interface`, params);
};

const getAccountTransaction = (id, params) => {
  return request(`${_ACCOUNT_URL}/${id}/transactions`, { params });
};

const getTrialbalance = (params) => {
  return request(_TRIAL_BALANCE, { params });
};
const getIncomeStatement = (params) => {
  return request(_INCOME_STATEMENT, { params });
};
const getFinancialCondition = (params) => {
  return request(_BALANCE_SHEET, { params });
};

const getChartsOfAccountsV2 = (params) => {
  return request(_CHART_OF_ACCOUNTS_URL_V2, { params });
};

const getBanks = (parentAccountHierarchy) => {
  return request(`${_BANKS}/${parentAccountHierarchy}`);
};

export const accountingService = {
  fetchReceipts,
  createReceipt,
  fetchPayments,
  createPayment,
  updateReceipt,
  deleteStatement,
  updatePayment,

  //New URLs
  getAccount,
  fetchAccounts,
  getChartsOfAccounts,
  createAccount,
  updateAccount,
  getIncomeExpenseAccounts,
  getTrialbalance,
  getIncomeStatement,
  getFinancialCondition,
  getAccountEntries,
  getLiteAccount,
  getAccountTransaction,
  getChartsOfAccountsV2,
  getFinancialYears,
  createAccountV2,
  getAccounts,
  getAccountsInterface,
  getAccountsInterfaceByName,
  updateAccountInterface,
  getBanks,
};
