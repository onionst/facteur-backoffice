import { ChevronDown, ChevronUp } from 'react-feather';
import s from './Sorter.module.scss';

export type order = 'ASC' | 'DESC';

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
        {props.order === 'DESC' ? <ChevronUp size={12} color="#252f4a" /> : <ChevronDown size={12} color="#252f4a" />}
      </div>
    </button>
  );
}
