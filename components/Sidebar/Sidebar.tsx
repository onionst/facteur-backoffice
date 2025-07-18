import { Popover, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties, useEffect } from 'react';
import { ChevronRight, ChevronsRight, LogOut, MessageCircle, Minus, Plus, User } from 'react-feather';
import s from './Sidebar.module.scss';
import IconButton from '@/bases/IconButton/IconButton';
import Logo from '@/bases/Logo';
import { ROLES } from '@/constants/roles.constants';
import { SECTIONS } from '@/constants/sections.constant';
import { SETTINGS } from '@/constants/settings';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';

export type SidebarProps = {
  collapsed: boolean;
  style?: CSSProperties;
  setCollapsed: (v: boolean) => void;
  mobile?: boolean;
  onClose?: () => void;
};

export const CHATBOT_SECTION_ID = 'chatbot';

export default function Sidebar(props: SidebarProps) {
  const { session, signOut } = useAuth();
  const {
    auth: { showAccount }
  } = useModal();
  const { collapsed, setCollapsed } = props;

  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes('/repository/search')) {
      setCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const allowedSections = session.role
    ? SECTIONS.filter(i => i?.access?.includes(session.role)).map(sections => {
        return {
          ...sections,
          sections: sections.sections?.filter((section: { access: string | ROLES[] }) => section?.access?.includes(session.role))
        };
      })
    : [];

  if (collapsed) {
    return (
      <aside className={s['ds-sidebar--collapsed']}>
        <div className={s['ds-sidebar-t']}>
          <section className={s['ds-sidebar--collapsed__top']}>
            <IconButton onClick={() => setCollapsed(false)}>
              <Plus color="#252f4a" size={18} />
            </IconButton>
          </section>
          <section className={s['ds-sidebar__sections']}>
            {allowedSections.map(section => {
              return (
                <div className={s['ds-sidebar--collapsed__sections-group']} key={section?.name}>
                  <div className={s['ds-sidebar--collapsed__sections-head']}>
                    <h6>{section?.name?.substring(0, 5).trim()}</h6>
                  </div>
                  <ul>
                    {section?.sections?.map(item => {
                      return (
                        <Link href={item?.path || '/app'} key={item?.path} target={item?.target ? item?.target : '_self'}>
                          <Tooltip placement="right" title={item?.name}>
                            <li
                              className={`${s['ds-sidebar--collapsed__sections-item']} ${
                                item?.path ? (router.asPath.includes(item?.path) ? s['ds-sidebar__sections-item--selected'] : '') : ''
                              }`}
                            >
                              <div>{item?.icon}</div>
                            </li>
                          </Tooltip>
                        </Link>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </section>
        </div>
        <div className="w-full">
          {SETTINGS.PUBLIC_SECTIONS.includes(CHATBOT_SECTION_ID) && (
            <section className={s['ds-sidebar__sections']}>
              <div className={s['ds-sidebar__sections-group']}>
                <ul>
                  <Link href={'/app/chatbot'} onClick={() => props.mobile && props.onClose && props.onClose()}>
                    <Tooltip placement="right" title="Chatbot">
                      <li className={`${s['ds-sidebar--collapsed__sections-item']}`} style={{ backgroundColor: '#00986d' }}>
                        <div>
                          <MessageCircle size={18} strokeWidth={2.3} color="#FFF" />
                        </div>
                      </li>
                    </Tooltip>
                  </Link>
                </ul>
              </div>
            </section>
          )}
          <Popover
            trigger={['click']}
            content={
              <div style={{ width: collapsed ? 200 : 210 }} className={s['ds-sidebar__popup']}>
                <li className={s['ds-sidebar--collapsed__sections-item']} onClick={showAccount}>
                  <div>
                    <User size={18} strokeWidth={2.3} color="#071437" />
                    <span>{session.role === ROLES.ADMIN || session.role === ROLES.RESEARCHER ? 'Account & API Keys' : 'Account'}</span>
                  </div>
                </li>

                <li className={s['ds-sidebar--collapsed__sections-item']} onClick={() => signOut()}>
                  <div>
                    <LogOut size={18} strokeWidth={2.3} color="#fa4c41" />
                    <span style={{ color: '#fa4c41' }}>Sign out</span>
                  </div>
                </li>
              </div>
            }
          >
            <section className={s['ds-sidebar__user']}>
              <div>
                <User color="#252f4a" size={18} />
              </div>
            </section>
          </Popover>
        </div>
      </aside>
    );
  }

  return (
    <aside className={s['ds-sidebar']} style={props.style}>
      <div className={s['ds-sidebar-t']}>
        <section className={s['ds-sidebar__top']}>
          <Logo size="M" />
          <IconButton onClick={() => setCollapsed(true)}>
            <Minus color="#252f4a" size={18} />
          </IconButton>
        </section>
        <section className={s['ds-sidebar__sections']}>
          {allowedSections.map(section => {
            return (
              <div className={s['ds-sidebar__sections-group']} key={section.name}>
                <div className={s['ds-sidebar__sections-head']}>
                  <h6>{section?.name}</h6>
                </div>
                <ul>
                  {section?.sections?.map(item => {
                    return (
                      <Link
                        href={item?.path || '/app'}
                        key={item?.path}
                        target={item?.target ?? '_self'}
                        onClick={() => props.mobile && props.onClose && props.onClose()}
                      >
                        <li
                          className={`${s['ds-sidebar__sections-item']} ${
                            item?.path ? (router.asPath.includes(item?.path) ? s['ds-sidebar__sections-item--selected'] : '') : ''
                          }`}
                        >
                          <div>
                            {item?.icon}
                            <span>{item?.name}</span>
                          </div>
                          <ChevronRight size={16} color="#99a1b7" />
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </div>
      <div className="w-full">
        {SETTINGS.PUBLIC_SECTIONS.includes(CHATBOT_SECTION_ID) && (
          <section className={s['ds-sidebar__sections']}>
            <div className={s['ds-sidebar__sections-group']}>
              <ul>
                <Link href={'/app/chatbot'} onClick={() => props.mobile && props.onClose && props.onClose()}>
                  <li className={`${s['ds-sidebar__sections-item']}`} style={{ backgroundColor: '#00986d' }}>
                    <div>
                      <MessageCircle size={18} strokeWidth={2.3} color="#FFF" />
                      <span style={{ color: '#FFF' }}>Chatbot</span>
                    </div>
                    <ChevronsRight size={16} color="#FFF" />
                  </li>
                </Link>
              </ul>
            </div>
          </section>
        )}
        <Popover
          placement="top"
          arrow={false}
          trigger={['click']}
          content={
            <div style={{ width: collapsed ? 200 : 210 }} className={s['ds-sidebar__popup']}>
              <li
                className={s['ds-sidebar--collapsed__sections-item']}
                onClick={() => {
                  showAccount();
                  props.mobile && props.onClose && props.onClose();
                }}
              >
                <div>
                  <User size={18} strokeWidth={2.3} color="#071437" />
                  <span>{session.role === ROLES.ADMIN || session.role === ROLES.RESEARCHER ? 'Account & API Keys' : 'Account'}</span>
                </div>
              </li>

              <li
                className={s['ds-sidebar--collapsed__sections-item']}
                onClick={() => {
                  signOut();
                  props.mobile && props.onClose && props.onClose();
                }}
              >
                <div>
                  <LogOut size={18} strokeWidth={2.3} color="#fa4c41" />
                  <span style={{ color: '#fa4c41' }}>Sign out</span>
                </div>
              </li>
            </div>
          }
        >
          <section className={s['ds-sidebar__user']}>
            <div>
              <User color="#252f4a" size={18} />
            </div>
            <section>
              <h6>
                {session?.name} {session?.surname}
              </h6>
              <span>{session?.email}</span>
            </section>
          </section>
        </Popover>
      </div>
    </aside>
  );
}
