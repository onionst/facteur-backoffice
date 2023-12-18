import Logo from "@/bases/logo";
import s from "./Sidebar.module.scss";
import { ChevronRight, LogOut, Minus, Plus, User } from "react-feather";
import { SECTIONS } from "@/constants/sections.constant";
import Link from "next/link";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IconButton from "@/bases/IconButton/IconButton";
import { useAuth } from "@/contexts/auth.context";
import { Popover } from "antd";
import Button from "@/bases/Button/Button";

export type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Sidebar(props: SidebarProps) {
  const { session, signOut } = useAuth();
  const { collapsed, setCollapsed } = props;

  const allowedSections = session.role
    ? SECTIONS.filter((i) => i?.access?.includes(session.role)).map(
        (sections) => {
          return {
            ...sections,
            sections: sections.sections?.filter((i) =>
              i?.access?.includes(session.role)
            ),
          };
        }
      )
    : [];

  if (collapsed) {
    return (
      <aside className={s["ds-sidebar--collapsed"]}>
        <div className={s["ds-sidebar-t"]}>
          <section className={s["ds-sidebar--collapsed__top"]}>
            <IconButton onClick={() => setCollapsed(false)}>
              <Plus color="#252f4a" size={18} />
            </IconButton>
          </section>
          <section className={s["ds-sidebar__sections"]}>
            {allowedSections.map((section) => {
              return (
                <div
                  className={s["ds-sidebar--collapsed__sections-group"]}
                  key={section?.name}
                >
                  <div className={s["ds-sidebar--collapsed__sections-head"]}>
                    <h6>{section?.name?.substring(0, 5).trim()}</h6>
                  </div>
                  <ul>
                    {section?.sections?.map((item) => {
                      return (
                        <Link href={item?.path || "/app"} key={item?.path}>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip placement="right">{item?.name}</Tooltip>
                            }
                          >
                            <li
                              className={
                                s["ds-sidebar--collapsed__sections-item"]
                              }
                            >
                              <div>{item?.icon}</div>
                            </li>
                          </OverlayTrigger>
                        </Link>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </section>
        </div>
        <Popover
          trigger={["click"]}
          content={
            <div style={{ width: collapsed ? 120 : 210 }}>
              <li className={s["ds-sidebar--collapsed__sections-item"]}>
                <div>
                  <User size={18} strokeWidth={2.3} color="#071437" />
                  <span>Account</span>
                </div>
              </li>
              <li
                className={s["ds-sidebar--collapsed__sections-item"]}
                onClick={() => signOut()}
              >
                <div>
                  <LogOut size={18} strokeWidth={2.3} color="#fa4c41" />
                  <span style={{ color: "#fa4c41" }}>Sign out</span>
                </div>
              </li>
            </div>
          }
        >
          <section className={s["ds-sidebar__user"]}>
            <div>
              <User color="#252f4a" size={18} />
            </div>
          </section>
        </Popover>
      </aside>
    );
  }

  return (
    <aside className={s["ds-sidebar"]}>
      <div className={s["ds-sidebar-t"]}>
        <section className={s["ds-sidebar__top"]}>
          <Logo size="S" />
          <IconButton onClick={() => setCollapsed(true)}>
            <Minus color="#252f4a" size={18} />
          </IconButton>
        </section>
        <section className={s["ds-sidebar__sections"]}>
          {allowedSections.map((section) => {
            return (
              <div
                className={s["ds-sidebar__sections-group"]}
                key={section.name}
              >
                <div className={s["ds-sidebar__sections-head"]}>
                  <h6>{section?.name}</h6>
                </div>
                <ul>
                  {section?.sections?.map((item) => {
                    return (
                      <Link href={item?.path || "/app"} key={item?.path}>
                        <li className={s["ds-sidebar__sections-item"]}>
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
      <Popover
        placement="top"
        arrow={false}
        trigger={["click"]}
        content={
          <div style={{ width: collapsed ? 200 : 210 }}>
            <li className={s["ds-sidebar--collapsed__sections-item"]}>
              <div>
                <User size={18} strokeWidth={2.3} color="#071437" />
                <span>Account</span>
              </div>
            </li>
            <li
              className={s["ds-sidebar--collapsed__sections-item"]}
              onClick={() => signOut()}
            >
              <div>
                <LogOut size={18} strokeWidth={2.3} color="#fa4c41" />
                <span style={{ color: "#fa4c41" }}>Sign out</span>
              </div>
            </li>
          </div>
        }
      >
        <section className={s["ds-sidebar__user"]}>
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
    </aside>
  );
}
