import Image from 'next/image';
import Link from 'next/link';
import s from './Footer.module.scss';
import Row from '@/bases/Row/Row';

export default function Footer() {
  return (
    <footer className={s['ds-footer']}>
      <Row align="SPACE">
        <section className={s['ds-footer__left']}>
          <Link target="_blank" href={'https://efcsn.com/contact/'}>
            <span>Point of contact</span>
          </Link>
          <Link target="_blank" href={'https://efcsn.com/privacy-policy'}>
            <span>Privacy policy</span>
          </Link>
        </section>
        <Link target="_blank" href={'https://newtral.es'}>
          <Image src="/assets/powered.svg" height={38} width={105} alt={''} />
        </Link>
      </Row>
    </footer>
  );
}
