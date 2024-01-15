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
        <section className={s['ds-footer__right']}>
          <Image src="/assets/flags/eu.png" height={70} width={105} alt={''} />
          <span>
            EFCSN is supported by the European Union under the 2020 work programme on the financing of Pilot Projects and Preparatory
            Actions in the field of “Communications Networks, Content and Technology”
          </span>
        </section>
      </Row>
    </footer>
  );
}
