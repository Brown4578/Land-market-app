import request from '../_helpers/requests';
import { _FILES } from '../_helpers/apis';

const fetchFiles = (params) => {
  return request(_FILES, { params });
};

export const filesService = {
  fetchFiles,
};
