import { LoadingOutlined } from '@ant-design/icons';
import { Spin, notification } from 'antd';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import Store from 'store';
import { useArticles } from './articles.context';
import { useOrganizations } from './organizations.context';
import { useRepository } from './repository.context';
import { useUsers } from './users.context';
import Logo from '@/bases/Logo';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { ROLES } from '@/constants/roles.constants';
import { STORAGE_KEYS } from '@/constants/store.constant';
import { Credentials } from '@/dtos/credentials.dto';
import { RefreshToken } from '@/dtos/google-refresh-token.dto';
import { Session } from '@/dtos/session.dto';
import { Join as JoinDto } from '@/dtos/users/Join.dto';
import {
  GetApiCredentials,
  GetGoogleAccessToken,
  doOpenGoogleLogin,
  GetGoogleRefreshToken,
  GetSessionData,
  RefreshApiCredentials,
  RestorePassword,
  SendRestorePasswordEmail,
  SignInWithEmailAndPassword,
  SignInWithTFAToken,
  SetupTFA
} from '@/services/auth.service';
import { Join } from '@/services/user.service';

export type AuthContextProps = {
  session: Session;
  loading: boolean;
  doOpenGoogleLogin: string;
  signInWithEmailAndPassword: (credentials: Credentials) => Promise<void>;
  signInWithTFAToken: (token: string) => Promise<void>;
  sendRestorePasswordEmail: (email: string) => Promise<void>;
  restorePassword: (password: string) => Promise<void>;
  getApiCredentials: (id?: string, type?: string) => Promise<string>;
  acceptInvitation: (join: JoinDto, token: string) => Promise<void>;
  refreshApiCredentials: (id?: string, type?: string) => Promise<string>;
  googleAccessToken: (code: string) => Promise<void>;
  googleRefreshToken: (googleRefreshToken: RefreshToken) => Promise<string>;
  setupTFA: () => Promise<void>;
  signOut: () => Promise<void>;
};
export type AuthProviderProps = { children: any };

export const AuthContext = createContext<AuthContextProps>(
  // @ts-ignore
  {}
);

export const AuthProvider = (props: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const organizations = useOrganizations();
  const users = useUsers();
  const articles = useArticles();
  const router = useRouter();
  const repository = useRepository();

  const [session, setSession] = useState<Session>({
    email: '',
    role: ROLES.NONE,
    name: '',
    surname: '',
    organizationId: ''
  });

  useEffect(() => {
    getSessionData(router.asPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApiCredentials = async (id?: string, type?: string) => {
    try {
      return await GetApiCredentials(id, type);
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      throw new Error('Unauthorized');
    }
  };

  const refreshApiCredentials = async (id?: string, type?: string) => {
    try {
      return await RefreshApiCredentials(id, type);
    } catch (err: any) {
      console.error(err);
      throw new Error('Unauthorized');
    }
  };

  const getSessionData = async (path: string, wait?: boolean) => {
    try {
      const accessToken = Store.get(STORAGE_KEYS.ACCESS_TOKEN, null);
      if (path.includes('app') && !accessToken) {
        router.push('/auth/sign-in');
      }
      if (path.includes('auth') && accessToken) {
        router.push('/app');
      }
      if (path === '/') {
        if (accessToken) {
          router.push('/app');
        } else {
          router.push('/auth/sign-in');
        }
      }
      if (accessToken) {
        if (!session?.email) {
          setLoading(true);
        }
        const { data } = await GetSessionData();
        setSession(data);
        if (data?.role === ROLES.SUPER_ADMIN) {
          organizations.fetchOrganizations({
            order: 'DESC',
            orderBy: 'creationDate'
          });
        }
        if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(data?.role)) {
          users.fetchUsers({});
        }
        repository.fetchRepositoryArticles({
          order: '-datePublished'
        });
        organizations.listOrganizations();
        if ([ROLES.ADMIN, ROLES.FACT_CHECKER].includes(data?.role)) {
          articles.fetchArticles({
            order: '-dateModified',
            publisher: data?.organization?.domain
          });
        }

        if (!wait) {
          setLoading(false);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console

      await signOut(true);
      setLoading(false);
    }
  };

  const signInWithEmailAndPassword = async (credentials: Credentials) => {
    try {
      const status = await SignInWithEmailAndPassword(credentials);
      if (status === '2FA') {
        router.push('/auth/sign-in?tfa=pending');
      } else {
        await getSessionData('/app');
        notification.success({
          ...NOTIFICATIONS_CONFIG.success,
          message: 'Welcome Back!',
          description: "You've successfully signed in"
        });
        router.push('/app');
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid password or email'
        });
      }
      throw new Error('Unauthorized');
    }
  };

  const signInWithTFAToken = async (token: string) => {
    try {
      await SignInWithTFAToken(token);
      await getSessionData('/app', true);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Welcome Back!',
        description: "You've successfully signed in"
      });
      router.push('/app');
      setLoading(false);
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid or expired link. Please sign in again'
        });
      }
      throw new Error('Forbidden');
    }
  };

  const sendRestorePasswordEmail = async (email: string) => {
    try {
      await SendRestorePasswordEmail(email);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Please check your email'
      });
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      throw new Error('Forbidden');
    }
  };

  const restorePassword = async (password: string) => {
    try {
      const token: any = router?.query?.t;
      RestorePassword(token, password);
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Password changed'
      });
      router.push('/auth/sign-in');
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid or expired link.'
        });
        router.push('/auth/sign-in');
      }
      throw new Error('Unauthorized');
    }
  };

  const acceptInvitation = async (join: JoinDto, token: string) => {
    try {
      if (!token || typeof token != 'string') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid or expired link. Please, contact your administrator.'
        });
        router.push('/auth/sign-in');
      } else {
        await Join(join, token);
        await getSessionData('/app');
        notification.success({
          ...NOTIFICATIONS_CONFIG.success,
          message: 'Welcome Back!',
          description: "You've successfully signed in"
        });
        router.push('/app');
      }
    } catch (err: any) {
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      }
      throw new Error('Forbidden');
    }
  };

  const googleLoginModal = async () => {
    return doOpenGoogleLogin;
  };

  const googleAccessToken = async (code: string) => {
    try {
      await GetGoogleAccessToken(code);
      await getSessionData('/app');
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Welcome Back!',
        description: "You've successfully signed in"
      });
      router.push('/app');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else if (err.name === 'AxiosError') {
        const { message } = err.response.data;
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: message ?? 'Invalid google access token'
        });
      } else if (err.message === 'User is not active' || err.message === 'User does not exist') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: `${err.message}. Please contact the site administrator.`
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid google access token'
        });
      }
      throw new Error('Unauthorized');
    }
  };

  const googleRefreshToken = async (refreshToken: RefreshToken) => {
    try {
      const status = await GetGoogleRefreshToken(refreshToken);
      await getSessionData('/app');
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Welcome Back!',
        description: "You've successfully signed in"
      });
      return status;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid google refresh token'
        });
      }
      throw new Error('Unauthorized');
    }
  };

  const setupTFA = async () => {
    try {
      await SetupTFA();
      setSession(prev => ({
        ...prev,
        TFA: true
      }));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else if (err.name === 'AxiosError') {
        const { message } = err.response.data;
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: message ?? 'Invalid google access token'
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Invalid google access token'
        });
      }
      throw new Error('Unauthorized');
    }
  };

  const signOut = async (expired?: boolean) => {
    try {
      setSession({
        email: '',
        role: ROLES.NONE,
        name: '',
        surname: '',
        organizationId: ''
      });
      await Store.remove(STORAGE_KEYS.ACCESS_TOKEN);
      await Store.remove(STORAGE_KEYS.EFCSN_REFRESH_TOKEN);
      await Store.remove(STORAGE_KEYS.GOOGLE_REFRESH_TOKEN);
      if (expired) {
        router.push('/auth/sign-in?expired=true');
      } else {
        router.push('/auth/sign-in');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw new Error('Default');
    }
  };

  const context = {
    session,
    loading,
    signInWithEmailAndPassword,
    signInWithTFAToken,
    sendRestorePasswordEmail,
    restorePassword,
    acceptInvitation,
    getApiCredentials,
    refreshApiCredentials,
    signOut,
    googleLoginModal,
    doOpenGoogleLogin,
    googleAccessToken,
    googleRefreshToken,
    setupTFA
  };

  return (
    <AuthContext.Provider value={context}>
      {loading ? (
        <div
          style={{
            width: '100vw',
            height: '100dvh',
            gap: '16px',
            backgroundColor: '#FFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div>
            <Spin indicator={<LoadingOutlined />} size="default" />
          </div>
          <Logo size="M" />
        </div>
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
