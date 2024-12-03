import Link from 'next/link';
import { useRouter } from 'next/router';
import { Plus } from 'react-feather';
import RepositorySearch from '../RepositorySearch/RepositorySearch';
import s from './Navbar.module.scss';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export type NavbarProps = {
  openDrawer?: () => void;
  collapsed: boolean;
};

export default function Navbar(props: NavbarProps) {
  const router = useRouter();
  const { width } = useWindowSize();
  const { session } = useAuth();
  return (
    <nav
      className={s['ds-navbar']}
      style={{
        width: width < 768 ? '100%' : `calc(100% - ${props.collapsed ? 74 : 270}px)`
      }}
    >
      <section className={s['ds-navbar__left']}>
        {width < 768 && (
          <IconButton onClick={props?.openDrawer}>
            <Plus color="#252f4a" size={18} />
          </IconButton>
        )}
        {!router.asPath.includes('/repository/search') && (
          <RepositorySearch
            onSearch={filter => {
              router.push(`/app/repository/search?q=${filter.value}&&c=${filter.type}&&ft=${filter.fileType}`);
            }}
          />
        )}
      </section>
      <section className={s['ds-navbar__right']}>
        {[ROLES.ADMIN, ROLES.FACT_CHECKER].includes(session.role) && !router.asPath.includes('/articles') && (
          <Link href="/app/data/articles/new">
            <Button theme="TERTIARY">
              <span>
                Create article <Plus size={14} />
              </span>
            </Button>
          </Link>
        )}
      </section>
    </nav>
  );
}
