import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return null;
    }
    return response.data;
  },
  (error) => {
    let message = 'Request failed.';
    if (error.response) {
      message = error.response.data?.message || error.response.data?.error || `${error.response.status} ${error.response.statusText}`.trim();
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export function get(path) {
  return api.get(path);
}

export function post(path, body) {
  return api.post(path, body);
}

export function put(path, body) {
  return api.put(path, body);
}

export function remove(path) {
  return api.delete(path);
}
