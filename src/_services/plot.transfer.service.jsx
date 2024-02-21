import request from '../_helpers/requests';
import { _PLOT_TRANSFER } from '../_helpers/apis';

const fetchTransfers = (params) => {
  return request(`${_PLOT_TRANSFER}s`, { params });
};

const fetchTransfersByPlotId = (plotId, params) => {
  return request(`${_PLOT_TRANSFER}/${plotId}`, { params });
};

const createPlotTransfer = (data) => {
  return request.post(`${_PLOT_TRANSFER}`, data);
};

export const plotTransferService = {
  fetchTransfers,
  fetchTransfersByPlotId,
  createPlotTransfer,
};
