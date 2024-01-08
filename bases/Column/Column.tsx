import { CSSProperties } from 'react';
import s from './Column.module.scss';
export type ColumnProps = {
  align: 'LEFT' | 'RIGHT' | 'CENTER' | 'SPACE';
  children: any;
  style?: CSSProperties;
};
export default function Column(props: ColumnProps) {
  return (
    <div className={`${s['ds-column']} ${s['ds-column--' + props.align]}`} style={props.style}>
      {props.children}
    </div>
  );
}
