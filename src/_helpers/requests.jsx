import axios from 'axios';
import { AUTH_CONFIG } from '../../Config';
import { notification, message } from 'antd';
import {
  removeAccess,
  setAccessToken,
  getAccessToken,
  decryptJwtToken,
} from './globalVariables';
import { userService } from '../_services';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { CHANGE_PASSWORD } from './apis';

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled
    ? false
    : true;
};

const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    let token =
      getAccessToken() ||
      (localStorage.getItem('access_token') &&
        decryptJwtToken(localStorage.getItem('access_token')));
    if (
      token &&
      request.url !== AUTH_CONFIG.AUTH_URL &&
      request.url !== CHANGE_PASSWORD
    ) {
      request.headers['Authorization'] = `Bearer ${token}`;
      request.headers['Content-Type'] = `application/json`;
    }

    request.headers['Access-Control-Allow-Origin'] = '*';
  }
  return request;
};

const instance = axios.create({
  mode: 'cors',
  baseURL: `http://localhost:8080`,
  // baseURL: `http://loans.ciphercom.co.ke:8080`,
});

instance.interceptors.request.use((request) => requestHandler(request));

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (error.response && error.response.status === 500) {
      const { response } = error;
      const { data, ...rest } = response;
      notification['error']({
        message: data?.header?.responseMessage,
      });
    } else if (!expectedError) {
      // Error notification
      notification['error']({
        message: 'System Error',
        description: 'An unexpected error occurred.',
      });
    } else {
      const { response } = error;
      const { request, ...errorObject } = response;

      switch (errorObject.status) {
        case 401:
          if (
            errorObject.data &&
            errorObject.data.message != null &&
            errorObject.data.message === 'Access is denied'
          ) {
            message.error('Access is denied');
          } else {
            message.error(errorObject.data?.header?.responseDescription);
          }
          break;
        case 403:
          message.info('Please log in to continue');
          userService.logout();
          break;
        case 409:
          // Error Notification
          notification['warning']({
            message: 'Server Error',
            description:
              errorObject.data?.header?.responseMessage ||
              errorObject.data?.header?.responseDescription,
          });
          break;
        default:
          // Error Notification
          notification['warning']({
            message: 'Server Message',
            description:
              errorObject.data?.header?.responseMessage ||
              errorObject.data?.header?.responseDescription,
          });
      }
    }
    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest) =>
  userService
    .refreshToken()
    .then((response) => {
      let access_token = response.data.access_token;
      setAccessToken(access_token);

      failedRequest.response.config.headers[
        'Authorization'
      ] = `Bearer ${access_token}`;

      return Promise.resolve();
    })
    .catch((error) => {
      removeAccess();
      message.info('Please log in to continue');
      userService.logout();
      return Promise.reject(error);
    });

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
