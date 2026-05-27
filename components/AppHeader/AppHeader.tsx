import { Popover } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { LogOut, Menu, Search, User } from 'react-feather';
import s from './AppHeader.module.scss';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';

function initials(name?: string, surname?: string): string {
  const a = name?.trim()?.[0] ?? '';
  const b = surname?.trim()?.[0] ?? '';
  return (a + b).toUpperCase() || '·';
}

export type AppHeaderProps = {
  onMenuClick?: () => void;
};

export default function AppHeader({ onMenuClick }: AppHeaderProps = {}) {
  const { session, signOut } = useAuth();
  const {
    auth: { showAccount }
  } = useModal();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push({ pathname: '/app/repository/search', query: { c: 'TEXT', q, ft: 'TEXT' } });
  };

  const org = session?.organization?.name;
  const country = session?.organization?.country;
  const displayName = session?.name || session?.email?.split('@')[0] || '';

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <div className={s.brand}>
          {onMenuClick && (
            <button type="button" className={s.menuBtn} onClick={onMenuClick} aria-label="Open menu">
              <Menu size={20} strokeWidth={2.2} />
            </button>
          )}
          <Link href="/app" className={s.logo} aria-label="Facteur home">
            Facteur
            <span className={s.dot} />
          </Link>
          <span className={s.tag}>
            Editorial · <span>Backoffice</span>
          </span>
        </div>
        <form className={s.search} onSubmit={handleSearch} role="search">
          <label className={s.searchField}>
            <Search size={16} strokeWidth={2.2} />
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles or claims…" />
          </label>
        </form>
        <div className={s.user}>
          {org && (
            <span className={s.org}>
              {org}
              {country ? ` · ${country}` : ''}
            </span>
          )}
          <Popover
            trigger={['click']}
            placement="bottomRight"
            arrow={false}
            content={
              <div className={s.menu}>
                <button type="button" className={s.menuItem} onClick={showAccount}>
                  <User size={16} strokeWidth={2.2} />
                  <span>{session.role === ROLES.ADMIN || session.role === ROLES.RESEARCHER ? 'Account & API Keys' : 'Account'}</span>
                </button>
                <button type="button" className={`${s.menuItem} ${s.menuItemDanger}`} onClick={() => signOut()}>
                  <LogOut size={16} strokeWidth={2.2} />
                  <span>Sign out</span>
                </button>
              </div>
            }
          >
            <button type="button" className={s.userBtn}>
              <span className={s.avatar}>{initials(session?.name, session?.surname)}</span>
              <span className={s.name}>{displayName}</span>
            </button>
          </Popover>
        </div>
      </div>
    </header>
  );
}
