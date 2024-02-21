import request from '../_helpers/requests';
import { _COMMISSION } from '../_helpers/apis';

const fetchCommissions = (params) => {
  return request.get(`${_COMMISSION}`, { params });
};

export const commissionService = {
  fetchCommissions,
};
