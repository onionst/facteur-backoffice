import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { ArrowLeft } from 'react-feather';
import s from './Header.module.scss';
import IconButton from '@/bases/IconButton/IconButton';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type HeaderProps = {
  children?: ReactNode;
  backable?: boolean;
  onBack?: () => void;
  title: string;
  subtitle?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  /* Kept for API compatibility with legacy callers — currently unused in the
     maqueta-styled header. */
  icon?: ReactNode;
};

export default function Header(props: HeaderProps) {
  const router = useRouter();
  const { breadcrumb, subtitle, backable, onBack, title, children } = props;

  return (
    <>
      <Head>
        <title>{title ? `${title} | Facteur` : 'Facteur'}</title>
      </Head>
      <header className={s.header}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className={s.breadcrumbs} aria-label="Breadcrumb">
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <span key={`${item.label}-${i}`} className={s.crumbWrap}>
                  {i > 0 && (
                    <span className={s.sep} aria-hidden="true">
                      /
                    </span>
                  )}
                  {item.href && !isLast ? (
                    <Link href={item.href} className={s.crumbLink}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? s.crumbCurrent : undefined} aria-current={isLast ? 'page' : undefined}>
                      {item.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        <div className={s.row}>
          <div className={s.text}>
            <h1 className={s.title}>
              {backable && (
                <IconButton type="button" onClick={() => (onBack ? onBack() : router.back())}>
                  <ArrowLeft color="var(--ink)" size={20} />
                </IconButton>
              )}
              <span>{title}</span>
            </h1>
            {subtitle && <p className={s.subtitle}>{subtitle}</p>}
          </div>
          {children && <div className={s.actions}>{children}</div>}
        </div>
      </header>
    </>
  );
}
