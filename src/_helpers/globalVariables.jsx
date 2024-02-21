import { useContext } from 'react';
import { useUserContext } from './userContext';
import { message } from 'antd';
import JwtDecode from 'jwt-decode';
import * as CryptoJS from 'crypto-js';
import { customHistory } from './history';

let accessToken;
let user;

//setting the access token
export const setAccessToken = (params, login = false) => {
  accessToken = params;
  const colorValue = localStorage.getItem('theme');
  if (!colorValue) {
    localStorage.setItem('theme', '#0a082a');
  }
  if (params) {
    setUser(params, login);
  }
};

//fetch the access token
export const getAccessToken = () => {
  return accessToken;
};

//remove users access
export const removeAccess = (params) => {
  localStorage.removeItem('access_token');
  // setAccessToken(null);
};

//set the users refresh token
export const setRefreshToken = (params) => {
  localStorage.setItem('access_token', encryptJwtToken(params));
};

//Encrypting JWT Token
export function encryptJwtToken(token) {
  const encryptedToken = CryptoJS.AES.encrypt(
    token,
    'eW&$8Qv_#XKm*7T6'
  ).toString();
  return encryptedToken;
}

//Decrypting JWT Token
export function decryptJwtToken(encryptedToken) {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, 'eW&$8Qv_#XKm*7T6');
  const token = bytes.toString(CryptoJS.enc.Utf8);
  return token;
}

const usePermissionsContext = () => {
  const { user } = useUserContext();

  return user;
};

export const validatePermission = (permissionToCheck) => {
  const context = usePermissionsContext();
  const permissionsArray = context?.permissions || [];

  if (permissionsArray && permissionsArray.length > 0) {
    return permissionsArray.some(
      (permission) => permission.permissionName === permissionToCheck
    );
  }

  return false;
};

export const validatePermissionWithUserPermissions = (
  permissionToCheck,
  permissionsArray
) => {
  if (permissionsArray && permissionsArray.length > 0) {
    return permissionsArray.some(
      (permission) => permission.permissionName === permissionToCheck
    );
  }

  return false;
};

//Get the user details eg. user name and id
export const setUser = async (params, login) => {
  try {
    let decoded = JwtDecode(params);

    const { aud, scope, exp, iat, jti, client_id, sub, ...newData } = decoded;

    localStorage.setItem('system_user', sub);
    user = newData;
    //If it is the 1st time the user is logging in.. Reset his password
    if (!user.first_time_login) {
    }

    //Ensuring full authentication before logging in the user
    if (!user.first_time_login && login) {
      customHistory.push('/');
    }
  } catch (error) {
    message.error(error.message);
  }
};

//Fetching the users details
export const getUser = () => {
  return user;
};

export const getParams = (location) => {
  let searchParams = new URLSearchParams(location.search);
  return {
    query: searchParams.get('query') || '',
  };
};

export const setParams = ({ query }) => {
  let searchParams = new URLSearchParams();
  searchParams.set('query', query || '');
  return searchParams.toString();
};

export const fileDownload = (data, name = '') => {
  // const file = new Blob([data]);
  const file = new Blob([data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

export const websocketUrl = () => {
  let token = getAccessToken();
  let url = '/ws/websocket';
  if (token) {
    url += '?access_token=' + token;
  }
  return url;
};
