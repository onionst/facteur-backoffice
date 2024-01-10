import { ArrowRightOutlined } from '@ant-design/icons';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { Input } from '../../bases/Input';
import { REDIRECT_URI } from './oauth-redirect';
import Button from '@/bases/Button/Button';
import Logo from '@/bases/Logo';
import { useAuth } from '@/contexts/auth.context';
import { Credentials } from '@/dtos/credentials.dto';

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const { signInWithEmailAndPassword, signInWithTFAToken } = useAuth();
  const { publicRuntimeConfig } = getConfig();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Credentials>({
    email: '',
    password: ''
  });

  useEffect(() => {
    try {
      if (router?.query?.t) {
        const token = router?.query?.t;
        if (token && typeof token === 'string') {
          signInWithTFAToken(token);
        }
      }
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleSignInWithCredentials = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      await signInWithEmailAndPassword(form);
      setForm({
        email: '',
        password: ''
      });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  const doSignIn =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    `?client_id=${publicRuntimeConfig.GOOGLE_OAUTH_ID}` +
    '&scope=profile%20email' +
    '&response_type=code' +
    '&access_type=offline' +
    '&prompt=consent' +
    `&redirect_uri=${REDIRECT_URI}`;

  return (
    <div className="ds-sign-in">
      <div className="ds-sign-in__left-container">
        <section className="ds-sign-in__left">
          <div className="ds-sign-in__left-t">
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Logo size="M" />
            </div>
            <h1>Sign in</h1>
            <p>Enter your email and password to continue</p>
          </div>
          <div className="ds-sign-in__left-g">
            <button type="button">
              <Link href={doSignIn}>
                <Image src="/assets/icons/g-icon.png" width={18} height={18} alt={''} />
                <span style={{ marginLeft: 12 }}>Continue with Google</span>
              </Link>
            </button>
          </div>
          <div className="ds-sign-in__left-s">
            <div />
            <span>or</span>
            <div />
          </div>
          <form onSubmit={handleSignInWithCredentials}>
            <Input
              required
              placeholder="username@organization.com"
              type="email"
              label="Email"
              value={form.email}
              onChange={email => setForm(prev => ({ ...prev, email: email.target.value }))}
              style={{ marginBottom: 16 }}
            />
            <Input
              required
              value={form.password}
              onChange={password =>
                setForm(prev => ({
                  ...prev,
                  password: password.target.value
                }))
              }
              placeholder="********"
              type="password"
              label="Password"
            />
            <div className="ds-forget">
              <u>
                <span onClick={() => router.push('/auth/restore')}>I forgot my password</span>
              </u>
            </div>
            <Button disabled={Object.values(form).includes('')} loading={loading} theme="CTA" style={{ marginTop: 32 }}>
              Sign in <ArrowRightOutlined />
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
