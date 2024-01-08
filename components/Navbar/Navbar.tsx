import { Paperclip, Plus } from 'react-feather';
import s from './Navbar.module.scss';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import { Input } from '@/bases/Input';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import useWindowSize from '@/hooks/useWindowWidth';

export type NavbarProps = {
  openDrawer?: () => void;
  collapsed: boolean;
};

export default function Navbar(props: NavbarProps) {
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
        <Input className={s['ds-navbar__left-input']} placeholder="Search in the EE24 dataset..." />
        <div className={s['ds-navbar__left-input__clip']}>
          <Paperclip size={18} color="#4b5675" />
        </div>
      </section>
      <section className={s['ds-navbar__right']}>
        {[ROLES.ADMIN, ROLES.FACT_CHECKER].includes(session.role) && (
          <Button theme="TERTIARY">
            <span>
              Create article <Plus size={14} />
            </span>
          </Button>
        )}
      </section>
    </nav>
  );
}
