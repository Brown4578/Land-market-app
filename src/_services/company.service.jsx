import request from '../_helpers/requests';
import { _COMPANY } from '../_helpers/apis';

const fetchCompanyDetails = (params) => {
  return request(`${_COMPANY}`, { params });
};

const createCompany = (data) => {
  return request.post(`${_COMPANY}`, data);
};
const updateCompanyDetails = (data) => {
  return request.put(`${_COMPANY}`, data);
};

export const companyDetailsService = {
  fetchCompanyDetails,
  createCompany,
  updateCompanyDetails,
};
