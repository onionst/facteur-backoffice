import Image from 'next/image';
import Link from 'next/link';
import s from './Footer.module.scss';
import Row from '@/bases/Row/Row';

export default function Footer() {
  return (
    <footer>
      <section className={s['ds-footer']}>
        <section className={s['ds-footer__center']}>
          <Row align="SPACE">
            <Link target="_blank" href={'https://commission.europa.eu/index_en'}>
              <Image src="/assets/EU_logo.png" height={50} width={250} alt={''} />
            </Link>
            <Link target="_blank" href={'https://efcsn.com/'}>
              <Image src="/assets/efcsn_logo.png" height={67} width={107} alt={''} />
            </Link>
          </Row>
          <Row align="SPACE">
            <p>
              <br />
              Co-funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily
              reflect those of the European Union or the European Commission. Neither the European Union nor the European Commission can be
              held responsible for them.
            </p>
          </Row>
        </section>
      </section>
      <Row align="SPACE">
        <p className={s['ds-footer__space']}></p>
      </Row>
      <section className={s['ds-footer__last_row']}>
        <Row align="SPACE">
          <section className={s['ds-footer__left']}>
            <Link target="_blank" href={'https://elections24.efcsn.com/contact'}>
              <span>Point of contact</span>
            </Link>
            <Link target="_blank" href={'https://elections24.efcsn.com/privacy-policy'}>
              <span>Privacy policy</span>
            </Link>
          </section>
          <p className={s['ds-footer__contact']}>
            If you have any questions or comments, please contact us at{' '}
            <a href="mailto:support@efcsn.freshdesk.com">support@efcsn.freshdesk.com</a>
          </p>
          <Link target="_blank" href={'https://newtral.es'}>
            <Image src="/assets/powered.svg" height={42} width={115} alt={''} />
          </Link>
        </Row>
      </section>
    </footer>
  );
}
