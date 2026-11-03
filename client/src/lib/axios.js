import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const apiBaseURL = configuredApiUrl
  ? (/\/api$/i.test(configuredApiUrl) ? configuredApiUrl : `${configuredApiUrl}/api`)
  : '/api';

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});