import Image from 'next/image';
import Link from 'next/link';
import s from './Footer.module.scss';
import Row from '@/bases/Row/Row';

export default function Footer() {
  return (
    <footer className={s['ds-footer']}>
      <Row align="SPACE">
        <section className={s['ds-footer__left']}>
          <Link target="_blank" href={'https://elections24.efcsn.com/contact'}>
            <span>Point of contact</span>
          </Link>
          <Link target="_blank" href={'https://efcsn.com/privacy-policy'}>
            <span>Privacy policy</span>
          </Link>
        </section>
        <p className={s['ds-footer-contact']}>
          If you have any questions or comments, please contact us at{' '}
          <a href="mailto:support@efcsn.freshdesk.com">support@efcsn.freshdesk.com</a>
        </p>
        <Link target="_blank" href={'https://newtral.es'}>
          <Image src="/assets/powered.svg" height={42} width={115} alt={''} />
        </Link>
      </Row>
    </footer>
  );
}
