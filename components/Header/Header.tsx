import s from "./Header.module.scss";
import Head from "next/head";

export type HeaderProps = {
  children: string;
};

export default function Header(props: HeaderProps) {
  return (
    <>
      <Head>
        <title>{props.children} | EFCSN</title>
      </Head>
      <header className={s["ds-header"]}>
        <h1>{props.children}</h1>
      </header>
    </>
  );
}
