import request from '../_helpers/requests';
import { _MARKETER } from '../_helpers/apis';

const fetchMarketers = (params) => {
  return request.get(`${_MARKETER}`, { params });
};

const createMarketer = (data) => {
  return request.post(`${_MARKETER}`, data);
};
const updateMarketer = (id, data) => {
  return request.put(`${_MARKETER}/${id}`, data);
};

export const marketerService = {
  fetchMarketers,
  createMarketer,
  updateMarketer,
};
