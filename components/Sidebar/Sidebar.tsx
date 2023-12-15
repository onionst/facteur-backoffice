import Logo from "@/bases/logo";
import s from "./Sidebar.module.scss";
import { ChevronRight, Minus, Plus } from "react-feather";
import { SECTIONS } from "@/constants/sections.constant";
import Link from "next/link";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Sidebar(props: SidebarProps) {
  const { collapsed, setCollapsed } = props;
  if (collapsed) {
    return (
      <aside className={s["ds-sidebar--collapsed"]}>
        <section className={s["ds-sidebar--collapsed__top"]}>
          <button onClick={() => setCollapsed(false)}>
            <Plus color="#252f4a" size={18} />
          </button>
        </section>
        <section className={s["ds-sidebar__sections"]}>
          {SECTIONS.map((section) => {
            return (
              <div className={s["ds-sidebar--collapsed__sections-group"]}>
                <div className={s["ds-sidebar--collapsed__sections-head"]}>
                  <h6>{section?.name?.substring(0, 3)}</h6>
                </div>
                <ul>
                  {section?.sections?.map((item) => {
                    return (
                      <Link href={item?.path || "/app"}>
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
      </aside>
    );
  }

  return (
    <aside className={s["ds-sidebar"]}>
      <section className={s["ds-sidebar__top"]}>
        <Logo size="S" />
        <button onClick={() => setCollapsed(true)}>
          <Minus color="#252f4a" size={18} />
        </button>
      </section>
      <section className={s["ds-sidebar__sections"]}>
        {SECTIONS.map((section) => {
          return (
            <div className={s["ds-sidebar__sections-group"]}>
              <div className={s["ds-sidebar__sections-head"]}>
                <h6>{section?.name}</h6>
              </div>
              <ul>
                {section?.sections?.map((item) => {
                  return (
                    <Link href={item?.path || "/app"}>
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
      <section></section>
    </aside>
  );
}
