import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties, useEffect } from 'react';
import { MessageCircle } from 'react-feather';
import s from './Sidebar.module.scss';
import { SECTIONS } from '@/constants/sections.constant';
import { SETTINGS } from '@/constants/settings';
import { useAuth } from '@/contexts/auth.context';

export type SidebarProps = {
  collapsed: boolean;
  style?: CSSProperties;
  setCollapsed: (v: boolean) => void;
  mobile?: boolean;
  onClose?: () => void;
};

export const CHATBOT_SECTION_ID = 'chatbot';

export default function Sidebar(props: SidebarProps) {
  const { session } = useAuth();
  const { collapsed, setCollapsed } = props;
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes('/repository/search')) {
      setCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const allowedSections = session.role
    ? SECTIONS.filter(i => i?.access?.includes(session.role)).map(section => ({
        ...section,
        sections: section.sections?.filter(item => item?.access?.includes(session.role))
      }))
    : [];

  const handleNavigate = () => {
    if (props.mobile && props.onClose) props.onClose();
  };

  const showChatbot = SETTINGS.PUBLIC_SECTIONS.includes(CHATBOT_SECTION_ID);

  return (
    <aside className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`} style={props.style} aria-label="Primary navigation">
      <button
        type="button"
        className={s.toggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 4l-5 5 5 5" />
        </svg>
      </button>

      <nav className={s.nav}>
        {allowedSections.map(section => (
          <div className={s.section} key={section.id}>
            <div className={s.sectionTitle}>{section.name}</div>
            {section.sections?.map(item => {
              const active = item.path ? router.asPath.includes(item.path) : false;
              const isExternal = item.target === '_blank';
              return (
                <Link
                  key={item.id}
                  href={item.path || '/app'}
                  target={item.target ?? '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`${s.item} ${active ? s.active : ''}`}
                  data-label={item.name}
                  onClick={handleNavigate}
                >
                  <span className={s.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={s.label}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {showChatbot && (
          <div className={s.section}>
            <Link href="/app/chatbot" className={`${s.item} ${s.itemAccent}`} data-label="Chatbot" onClick={handleNavigate}>
              <span className={s.icon} aria-hidden="true">
                <MessageCircle size={18} strokeWidth={2.3} />
              </span>
              <span className={s.label}>Chatbot</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
