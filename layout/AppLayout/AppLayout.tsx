import Logo from "@/bases/logo";
import s from "./AppLayout.module.scss";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";

export type LayoutProps = {
  children: any;
};

type AsideButtonProps = {
  children: any;
};

function AsideButton(props: AsideButtonProps) {
  return <button className={s["ds-app-ab"]}>{props.children}</button>;
}

export default function AppLayout(props: LayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <div
      className={`${s["ds-app"]} ${
        s[`ds-app--${collapsed ? "collapsed" : "regular"}`]
      }`}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main>
        <Navbar />
        <section className={s["ds-app__main"]}>{props.children}</section>
      </main>
    </div>
  );
}
