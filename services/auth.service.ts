import Store from 'store';
import { api, customApi, parseUrl } from './api';
import { STORAGE_KEYS } from '@/constants/store.constant';
import { Access } from '@/dtos/access.dto';
import { Credentials } from '@/dtos/credentials.dto';
import { GoogleAccessToken } from '@/dtos/google-access-token.dto';
import { GoogleRefreshToken } from '@/dtos/google-refresh-token.dto';

const PREFIX = '/auth';

export const SignInWithEmailAndPassword = async (credentials: Credentials): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/sign-in/credentials'), credentials);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return access.status;
};

export const SignInWithTFAToken = async (TFAToken: string): Promise<'AUTHORIZED'> => {
  const response = await customApi.post(
    parseUrl(PREFIX, '/2fa/sign-in/credentials'),
    {},
    {
      headers: {
        Authorization: `TFA ${TFAToken}`
      }
    }
  );
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return 'AUTHORIZED';
};

export const SendRestorePasswordEmail = async (email: string): Promise<void> => {
  await api.post(parseUrl(PREFIX, '/restore'), { email });
};

export const RestorePassword = async (token: string, password: string): Promise<void> => {
  await customApi.post(
    parseUrl(PREFIX, '/restore/password'),
    { password },
    {
      headers: {
        Authorization: `RST ${token}`
      }
    }
  );
};

export const GetSessionData = async () => {
  return await api.get(parseUrl(PREFIX, '/session'));
};

export const GetApiCredentials = async (id?: string, type?: string): Promise<string> => {
  const response = await api.get(parseUrl(PREFIX, `/api-credentials${id ? `/${id}?type=${type}` : ''}`));
  return response?.data;
};

export const RefreshApiCredentials = async (id?: string, type?: string): Promise<string> => {
  const response = await api.patch(parseUrl(PREFIX, `/api-credentials${id ? `/${id}?type=${type}` : ''}`));
  return response?.data;
};

export const GetGoogleAccessToken = async (googleAccessToken: GoogleAccessToken): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/google-access-token'), googleAccessToken);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return access.status;
};

export const GetGoogleRefreshToken = async (googleRefreshToken: GoogleRefreshToken): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/google-refresh-token'), googleRefreshToken);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return access.status;
};
