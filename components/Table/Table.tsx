import { Empty, Skeleton } from 'antd';
import { useMemo } from 'react';
import s from './Table.module.scss';

export type TableProps = {
  firstExtended?: boolean;
  columns: any[];
  data: any[][];
  loading?: boolean;
  notFound?: any;
  onRowClick?: (i: number) => void;
  clickable?: boolean;
};

export function Table(props: TableProps) {
  const Columns = useMemo(
    () =>
      props.columns.map((title, index) => (
        <th key={index} className={props.firstExtended ? s['ds-table-column--extended'] : ''}>
          {title}
        </th>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.columns]
  );

  const Loading = useMemo(
    () =>
      props.columns.map((_, index) => (
        <td key={index}>
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
        <tr
          style={{ cursor: props.clickable ? 'pointer' : 'default' }}
          key={index}
          onClick={() => props.onRowClick && props.onRowClick(index)}
        >
          {data.map((column, _index) => (
            <td className={s['ds-table-row__item']} key={`${index}${_index}`}>
              {column}
            </td>
          ))}
        </tr>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.data]
  );

  if (props.loading) {
    return (
      <div className={s['ds-table__container']}>
        <table className={s['ds-table']}>
          <thead>
            <tr>{Columns}</tr>
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
      <table className={s['ds-table']}>
        <thead>
          <tr>{Columns}</tr>
        </thead>
        <tbody>{Data}</tbody>
      </table>
      {props.data.length === 0 ? props.notFound ? props.notFound : <Empty /> : null}
    </div>
  );
}
