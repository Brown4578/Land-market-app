import request from '../_helpers/requests';
import { _DASHBOARD } from '../_helpers/apis';

const fetchDashboardData = (params) => {
  return request.get(`${_DASHBOARD}`, { params });
};

const getGraphsData = () => {
  return request.get(`${_DASHBOARD}/graph`);
};

export const dashboardService = {
  fetchDashboardData,
  getGraphsData,
};
