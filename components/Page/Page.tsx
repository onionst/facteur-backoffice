import { CSSProperties } from 'react';
import s from './Page.module.scss';
export type PageProps = { children?: any; style?: CSSProperties; className?: string };
export default function Page(props: PageProps) {
  return <article className={`${s['ds-page']} ${props.className || ''}`}>{props.children}</article>;
}
