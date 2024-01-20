import { notification } from 'antd';
import axios from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import Store from 'store';
import { GetGoogleRefreshToken, GetSessionData } from './auth.service';
import { HttpStatus } from './http-status.enum';
import { SETTINGS } from '@/constants/settings';
import { STORAGE_KEYS } from '@/constants/store.constant';
import { GoogleRefreshToken } from '@/dtos/google-refresh-token.dto';

export const api = axios.create({
  baseURL: SETTINGS.PUBLIC_API_URL
});

export const ee24api = axios.create({
  baseURL: SETTINGS.PUBLIC_ES_API_URL
});

export const customApi = axios.create({
  baseURL: SETTINGS.PUBLIC_API_URL
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
  async error => {
    const data = (error.response?.data as any) || {};
    const { message } = data ?? undefined;
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    // we can handle global errors here
    switch (status) {
      // authentication (token related issues)
      case HttpStatus.UNAUTHORIZED: {
        const { data: sessionData } = await GetSessionData();
        const { refreshToken } = sessionData;
        if (refreshToken) {
          const newStatus = await GetGoogleRefreshToken({ refreshToken } as GoogleRefreshToken);
          if ('AUTHORIZED' === newStatus) {
            return;
          }
        }
        return Promise.reject(new ApiError(HttpStatus.UNAUTHORIZED, message));
      }
      // forbidden (permission related issues)
      case HttpStatus.FORBIDDEN: {
        notification.info({
          message: 'Session Expired',
          description: 'Please re-enter your credentials to continue where you left off'
        });
        await Store.remove(STORAGE_KEYS.ACCESS_TOKEN);
        if (typeof window != 'undefined') {
          window.location.replace('/auth/sign-in');
        }
        return Promise.reject(new ApiError(HttpStatus.FORBIDDEN, message));
      }
      // bad request
      case HttpStatus.BAD_REQUEST: {
        return Promise.reject(new ApiError(HttpStatus.BAD_REQUEST, message));
      }
      // not found
      case HttpStatus.NOT_FOUND: {
        return Promise.reject(new ApiError(HttpStatus.NOT_FOUND, message));
      }
      // conflict
      case HttpStatus.CONFLICT: {
        return Promise.reject(new ApiError(HttpStatus.CONFLICT, message));
      }
      // unprocessable
      case HttpStatus.UNPROCESSABLE_ENTITY: {
        return Promise.reject(new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message));
      }
      // generic api error (server related) unexpected
      default: {
        return Promise.reject(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong fetching data'));
      }
    }
  }
);

export const parseUrl = (prefix: string, path: string = '/') => prefix + (path.startsWith('/') ? path : `/${path}`);
