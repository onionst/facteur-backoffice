import { CSSProperties, ReactNode } from 'react';
import s from './Card.module.scss';

export type CardProps = { theme?: 'LIGHT' | 'DEFAULT'; children: ReactNode; title?: string; titleProps?: any; style?: CSSProperties };
export default function Card(props: CardProps) {
  const theme = {
    DEFAULT: s['ds-card'],
    LIGHT: s['ds-card--light']
  }[props?.theme || 'DEFAULT'];

  return (
    <article className={theme} {...props}>
      {props.title && <h6 {...props.titleProps}>{props.title}</h6>}
      <section>{props.children}</section>
    </article>
  );
}
