import Image from 'next/image';
import Link from 'next/link';
import s from './Footer.module.scss';
import Row from '@/bases/Row/Row';

export default function Footer() {
  return (
    <footer className={s['ds-footer']}>
      <Row align="SPACE">
        <section className={s['ds-footer__left']}>
          <Link href={'https://efcsn.com/code-of-standards/#:~:text=Template%20Article%206-,POINT%20OF%20CONTACT,-PRIVACY%20POLICY'}>
            <span>Point of contact</span>
          </Link>
          <Link href={'https://efcsn.com/privacy-policy'}>
            <span>Privacy policy</span>
          </Link>
        </section>
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
