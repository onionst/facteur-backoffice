import { ArrowRightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import Button from '@/bases/Button/Button';
import Condition from '@/bases/Condition/Condition';
import { Input } from '@/bases/Input';
import Logo from '@/bases/Logo';

export default function Join() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<{
    token: string;
    email: string;
    name: string;
    surname: string;
    password: string;
  }>({
    token: '',
    email: '',
    name: '',
    surname: '',
    password: ''
  });
  const [conditions, setConditions] = useState<{
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    length: boolean;
  }>({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false
  });

  useEffect(() => {
    if (router?.query?.email) {
      setForm((prev: any) => ({
        ...prev,
        email: router?.query?.email
      }));
    }
    if (router?.query?.t) {
      setForm((prev: any) => ({
        ...prev,
        token: router?.query?.t
      }));
    }
  }, [router?.query]);

  useEffect(() => {
    const password = form.password;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password?.length >= 10;
    setConditions({
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      special: hasSpecialChar,
      length: isLongEnough
    });
  }, [form.password]);

  const handleJoinTeam = (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
            <h1>Join your team</h1>
            <p>Enter your name, surname and password to continue</p>
          </div>
          <div className="ds-sign-in__left-g">
            <button type="button">
              <span>
                <Image src="/assets/icons/g-icon.png" width={18} height={18} alt={''} />
                <span style={{ marginLeft: 12 }}>Continue with Google</span>
              </span>
            </button>
          </div>
          <div className="ds-sign-in__left-s">
            <div />
            <span>or</span>
            <div />
          </div>
          <form onSubmit={handleJoinTeam}>
            <Input
              required
              placeholder="username@organization.com"
              type="email"
              disabled
              label="Email"
              value={form.email}
              style={{ marginBottom: 16 }}
            />
            <div className="grid-50-50">
              <Input
                required
                placeholder="John"
                type="text"
                label="Name"
                value={form.name}
                onChange={name => setForm((prev: any) => ({ ...prev, name: name.target.value }))}
                style={{ marginBottom: 16 }}
              />
              <Input
                required
                placeholder="Doe"
                type="text"
                label="Surname"
                value={form.surname}
                onChange={surname => setForm((prev: any) => ({ ...prev, surname: surname.target.value }))}
                style={{ marginBottom: 16 }}
              />
            </div>
            <Input
              required
              placeholder="********"
              type="password"
              label="Password"
              value={form.password}
              onChange={password =>
                setForm(prev => ({
                  ...prev,
                  password: password.target.value
                }))
              }
              style={{ marginBottom: 16 }}
            />

            <div>
              <Condition style={{ marginBottom: 4 }} state={conditions.uppercase ? 'OK' : 'PENDING'}>
                One uppercase character
              </Condition>
              <Condition style={{ marginBottom: 4 }} state={conditions.lowercase ? 'OK' : 'PENDING'}>
                One lowercase character
              </Condition>
              <Condition style={{ marginBottom: 4 }} state={conditions.number ? 'OK' : 'PENDING'}>
                One number
              </Condition>
              <Condition style={{ marginBottom: 4 }} state={conditions.special ? 'OK' : 'PENDING'}>
                One special character <label style={{ color: '#78829d' }}>e.g: {'.$?#![](){}'}</label>
              </Condition>
              <Condition style={{ marginBottom: 4 }} state={conditions.length ? 'OK' : 'PENDING'}>
                10 character minimum
              </Condition>
            </div>

            <Button disabled={Object.values(form).includes('')} loading={loading} theme="CTA" style={{ marginTop: 32 }}>
              Create account <ArrowRightOutlined />
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
