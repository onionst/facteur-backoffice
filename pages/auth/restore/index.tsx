import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import Logo from '@/bases/Logo';
import { useAuth } from '@/contexts/auth.context';

export default function RestorePassword(): JSX.Element {
  const router = useRouter();
  const { sendRestorePasswordEmail } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleSendRestorePasswordEmail = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      await sendRestorePasswordEmail(email);
      setEmail('');
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

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
            <h1>Restore account</h1>
            <p>We will send you reset instructions </p>
          </div>

          <form style={{ marginTop: 32 }} onSubmit={handleSendRestorePasswordEmail}>
            <Input
              required
              placeholder="username@organization.com"
              type="email"
              label="Email"
              value={email}
              onChange={eventMail => setEmail(eventMail.target.value)}
            />
            <Button disabled={email == ''} loading={loading} theme="CTA" style={{ marginTop: 32 }}>
              Send email
            </Button>
            <Button onClick={() => router.push('/auth/sign-in')} type="button" theme="SECONDARY" style={{ marginTop: 8 }}>
              <ArrowLeftOutlined /> Go back
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
