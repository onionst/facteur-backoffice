import s from "./Header.module.scss";
import Head from "next/head";

export type HeaderProps = {
  children?: any;
  title: string;
  icon: any;
};

export default function Header(props: HeaderProps) {
  return (
    <>
      <Head>
        <title>{props.title} | EFCSN</title>
      </Head>
      <header className={s["ds-header"]}>
        <h1>
          {props.icon} {props.title}
        </h1>
        {props?.children}
      </header>
    </>
  );
}
