import axios from 'axios';
import { decryptJwtToken } from '../_helpers/globalVariables';

let TOKEN =
  localStorage.getItem('access_token') &&
  decryptJwtToken(localStorage.getItem('access_token'));

export default axios.create({
  baseURL: `http://localhost:8080`,
  // baseURL: `http://loans.ciphercom.co.ke:8080`,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${TOKEN}`,
  },
});
