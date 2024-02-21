import request from '../_helpers/requests';
import { _PLOT } from '../_helpers/apis';

const fetchPlots = (params) => {
  return request(_PLOT, { params });
};

const fetchPlotById = (id) => {
  return request(`${_PLOT}/${id}`);
};

const createPlot = (data) => {
  return request.post(_PLOT, data);
};

const updatePlot = (id,data) => {
  return request.put(`${_PLOT}/${id}`, data);
};

export const plotService = {
  fetchPlots,
  fetchPlotById,
  createPlot,
  updatePlot,
};
