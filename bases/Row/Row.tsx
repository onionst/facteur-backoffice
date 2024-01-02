import { CSSProperties } from 'react';
import s from './Row.module.scss';
export type RowProps = {
  align: 'LEFT' | 'RIGHT' | 'CENTER' | 'SPACE';
  children: any;
  style?: CSSProperties;
};
export default function Row(props: RowProps) {
  return (
    <div className={`${s['ds-row']} ${s['ds-row--' + props.align]}`} style={props.style}>
      {props.children}
    </div>
  );
}
