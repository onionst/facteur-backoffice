import { CSSProperties, ReactNode } from 'react';
import s from './Card.module.scss';

export type CardProps = { children: ReactNode; title?: string; titleProps?: any; style?: CSSProperties };
export default function Card(props: CardProps) {
  return (
    <article className={s['ds-card']} {...props}>
      {props.title && <h4 {...props.titleProps}>{props.title}</h4>}
      <section>{props.children}</section>
    </article>
  );
}
