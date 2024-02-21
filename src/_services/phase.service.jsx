import request from '../_helpers/requests';
import { _PHASE } from '../_helpers/apis';

const fetchPhases = (params) => {
  return request(_PHASE, { params });
};

const createPhase = (data) => {
  return request.post(_PHASE, data);
};

export const phaseService = {
  fetchPhases,
  createPhase,
};
