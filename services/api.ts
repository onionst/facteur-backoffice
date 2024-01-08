import axios from 'axios';
import getConfig from 'next/config';
import Store from 'store';
import { STORAGE_KEYS } from '@/constants/store.constant';

const { publicRuntimeConfig } = getConfig();

export const api = axios.create({
  baseURL: publicRuntimeConfig.PUBLIC_API_URL
});

export const customApi = axios.create({
  baseURL: publicRuntimeConfig.PUBLIC_API_URL
});

api.interceptors.request.use(
  config => {
    const accessToken = Store.get(STORAGE_KEYS.ACCESS_TOKEN, null);

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      config.headers['Authorization'] = '';
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const parseUrl = (prefix: string, path: string = '/') => prefix + (path.startsWith('/') ? path : `/${path}`);
