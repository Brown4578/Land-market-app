import request from '../_helpers/requests';
import { _SCAN } from '../_helpers/apis';
import http from './http-common';

const fetchPlotDocScans = (params) => {
  return request(`${_SCAN}`, { params });
};

const fetchPlotDocScansByPlot = (id) => {
  return request(`${_SCAN}/${id}`);
};

const previewScan = (scanId) => {
  return request(`${_SCAN}/${scanId}/preview`);
};

const uploadImage = (data, file, onUploadProgress) => {
  return http.post(
    `${_SCAN}/${data.plotId}/doc/${data.directoryName}/remarks/${data?.remarks}`,
    file,
    {
      headers: {
        'Content-Type': `application/json`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    }
  );
};

export const scannedDocsService = {
  fetchPlotDocScans,
  fetchPlotDocScansByPlot,
  previewScan,
  uploadImage,
};
