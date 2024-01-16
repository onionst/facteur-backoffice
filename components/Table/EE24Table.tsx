import { Empty, Skeleton } from 'antd';
import { useMemo } from 'react';
import s from './Table.module.scss';

export type EE24TableProps = {
  firstExtended?: boolean;
  columns: any[];
  data: any[][];
  loading?: boolean;
  onRowClick?: (index: number) => void;
};
export type EE24HeadlineProps = {
  image?: string;
  headline?: string;
};
export function EE24Headline(props: EE24HeadlineProps) {
  return (
    <div className={s['ds-headline']}>
      <img src={props.image || '/assets/portraits/image.svg'} alt={'ee24 image'} />
      <p>{props.headline}</p>
    </div>
  );
}

export function EE24Table(props: EE24TableProps) {
  const Columns = useMemo(
    () =>
      props.columns.map(title => (
        <th key={title} className={props.firstExtended ? s['ds-table-column--extended'] : ''}>
          {title}
        </th>
      )),
    [props.columns]
  );

  const Loading = useMemo(
    () =>
      props.columns.map(title => (
        <td key={title}>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </td>
      )),
    [props.columns]
  );

  const Data = useMemo(
    () =>
      props.data.map((data, index) => (
        <tr key={index} onClick={() => props.onRowClick && props.onRowClick(index)}>
          {data.map((column, _index) => (
            <td className={s['ds-table-row__item']} key={`${index}${_index}`}>
              {column}
            </td>
          ))}
        </tr>
      )),
    [props.data]
  );

  if (props.loading) {
    return (
      <div className={s['ds-table__container']}>
        <table className={`table table-striped gy-7 gs-7 ${s['ds-table']}`}>
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">{Columns}</tr>
          </thead>
          <tbody>
            <tr>{Loading}</tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={s['ds-table__container']}>
      <table className={`table table-striped gy-7 gs-7 ${s['ds-table']}`}>
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">{Columns}</tr>
        </thead>
        <tbody className={s['ds-table__tbody']}>{Data}</tbody>
      </table>
      {props.data.length === 0 ? <Empty /> : null}
    </div>
  );
}
