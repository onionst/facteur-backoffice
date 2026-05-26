import Link from 'next/link';
import s from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <span className={s.brand}>Facteur · WP3 Backoffice · v0.1</span>
        <nav className={s.links} aria-label="Footer">
          <Link href="https://elections24.efcsn.com/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy
          </Link>
          <Link href="https://elections24.efcsn.com/contact" target="_blank" rel="noopener noreferrer">
            Contact
          </Link>
          <a href="mailto:support@efcsn.freshdesk.com">Support</a>
        </nav>
        <span className={s.copyright}>© {year} Newtral · EFCSN</span>
      </div>
    </footer>
  );
}
