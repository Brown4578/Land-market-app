import request from '../_helpers/requests';
import { _REPORT } from '../_helpers/apis';

const fetchReports = (params) => {
  return request(_REPORT, { params, responseType: 'blob' });
};

export const reportsService = {
  fetchReports,
};
