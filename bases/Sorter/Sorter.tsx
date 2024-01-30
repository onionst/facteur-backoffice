import { ChevronDown, ChevronUp, Minus } from 'react-feather';
import s from './Sorter.module.scss';

export type order = 'ASC' | 'DESC' | 'NONE';

export type SorterProps = {
  children: any;
  onSort: () => void;
  order: order;
};

export function Sorter(props: SorterProps) {
  return (
    <button className={s['ds-sorter']} onClick={props.onSort}>
      {props.children}
      <div className={s['ds-sorter-box']}>
        {props.order === 'ASC' ? (
          <ChevronUp size={16} color="#252f4a" />
        ) : props.order === 'DESC' ? (
          <ChevronDown size={16} color="#252f4a" />
        ) : (
          <Minus size={14} color="#252f4a" />
        )}
      </div>
    </button>
  );
}
