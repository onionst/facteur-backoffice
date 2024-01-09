import s from './Page.module.scss';
export type PageProps = { children?: any };
export default function Page(props: PageProps) {
  return <article className={s['ds-page']}>{props.children}</article>;
}
