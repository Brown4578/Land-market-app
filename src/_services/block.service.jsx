import request from '../_helpers/requests';
import { _BLOCK } from '../_helpers/apis';

const fetchBlocks = (params) => {
  return request(_BLOCK, { params });
};

const createBlock = (data) => {
  return request.post(_BLOCK, data);
};

export const blockService = {
  fetchBlocks,
  createBlock,
};
