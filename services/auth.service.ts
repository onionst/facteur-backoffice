import Store from 'store';
import { api, customApi, parseUrl } from './api';
import { SETTINGS } from '@/constants/settings';
import { STORAGE_KEYS } from '@/constants/store.constant';
import { Access } from '@/dtos/access.dto';
import { Credentials } from '@/dtos/credentials.dto';
import { GoogleAccessToken } from '@/dtos/google-access-token.dto';
import { RefreshToken } from '@/dtos/google-refresh-token.dto';

const PREFIX = '/auth';

const REDIRECT_URI = `${SETTINGS.APP_URL}/auth/oauth-redirect`;

export const doOpenGoogleLogin =
  'https://accounts.google.com/o/oauth2/v2/auth' +
  `?client_id=${SETTINGS.GOOGLE_OAUTH_ID}` +
  '&scope=profile%20email' +
  '&response_type=code' +
  '&access_type=offline' +
  '&prompt=select_account' +
  `&redirect_uri=${REDIRECT_URI}`;

export const SignInWithEmailAndPassword = async (credentials: Credentials): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/sign-in/credentials'), credentials);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
    Store.set(STORAGE_KEYS.EFCSN_REFRESH_TOKEN, access?.refreshToken);
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
    Store.set(STORAGE_KEYS.EFCSN_REFRESH_TOKEN, access?.refreshToken);
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

export const SetupTFA = async (): Promise<void> => {
  await api.patch(parseUrl(PREFIX, '/2fa/enable'));
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

export const GetGoogleAccessToken = async (code: string): Promise<'AUTHORIZED' | '2FA'> => {
  const googleAccessToken = { code, redirectUri: REDIRECT_URI } as GoogleAccessToken;
  const response = await api.post(parseUrl(PREFIX, '/google-access-token'), googleAccessToken);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
    Store.set(STORAGE_KEYS.GOOGLE_REFRESH_TOKEN, access?.refreshToken);
  }
  return access.status;
};

export const GetGoogleRefreshToken = async (googleRefreshToken: RefreshToken): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/google-refresh-token'), googleRefreshToken);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
    Store.set(STORAGE_KEYS.GOOGLE_REFRESH_TOKEN, access?.refreshToken);
  }
  return access.status;
};

export const GetSessionRefreshToken = async (refreshToken: RefreshToken): Promise<'AUTHORIZED' | '2FA'> => {
  const response = await api.post(parseUrl(PREFIX, '/refresh-session'), refreshToken);
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
    Store.set(STORAGE_KEYS.EFCSN_REFRESH_TOKEN, access?.refreshToken);
  }
  return access.status;
};
