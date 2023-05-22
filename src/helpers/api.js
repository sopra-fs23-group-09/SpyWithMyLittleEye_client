import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

export const api = axios.create({
  baseURL: getDomain(),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
});

export const getErrorMessage = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    if (response.data.status) {
      return response.data.message;
    } else {
      return response.data;
    }

  } else {
    if (error.message.match(/Network Error/)) {
      return 'The server cannot be reached.Did you start it?';
    }
    return error.message;
  }
};