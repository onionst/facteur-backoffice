import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'react-feather';
import s from './Header.module.scss';
import IconButton from '@/bases/IconButton/IconButton';

export type HeaderProps = {
  children?: any;
  backable?: boolean;
  onBack?: () => void;
  title: string;
  icon: any;
};

export default function Header(props: HeaderProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{props.title ? `${props.title} | ` : ''}EFCSN</title>
      </Head>
      <header className={s['ds-header']}>
        <h1>
          {props.backable ? (
            <IconButton type="button" onClick={() => (props.onBack ? props.onBack() : router.back())}>
              <ArrowLeft color="#252f4a" size={18} />
            </IconButton>
          ) : (
            props.icon
          )}
          {props.title}
        </h1>
        {props?.children}
      </header>
    </>
  );
}
