import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';

const { publicRuntimeConfig } = getConfig();

export const REDIRECT_URI = `${publicRuntimeConfig.APP_URL}/auth/oauth-redirect`;

const OAuth = () => {
  const { googleAccessToken, session } = useAuth();
  const router = useRouter();
  const { query } = router;
  const { code } = query;

  useEffect(() => {
    if (!code) return;
    const authUser = async () => {
      if (!session?.email) await googleAccessToken(code as string).catch(() => router.push('app'));
    };

    authUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, session?.email]);

  return null;
};

export default OAuth;
