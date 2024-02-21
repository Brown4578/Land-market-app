import request from '../_helpers/requests';
import { _CODES } from '../_helpers/apis';

const fetchCodes = (params) => {
  return request.get(`${_CODES}`, { params });
};

const createCode = (data) => {
  return request.post(_CODES, data);
};
const editCode = (id, data) => {
  return request.put(`${_CODES}/${id}`, data);
};

const fetchCodeTypes = () => {
  return request.get(`${_CODES}/types`);
};

export const codesService = {
  fetchCodes,
  createCode,
  editCode,
  fetchCodeTypes,
};
