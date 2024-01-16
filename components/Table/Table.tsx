import { Empty, Skeleton } from 'antd';
import { useMemo } from 'react';
import s from './Table.module.scss';

export type TableProps = {
  firstExtended?: boolean;
  columns: any[];
  data: any[][];
  loading?: boolean;
};

export function Table(props: TableProps) {
  const Columns = useMemo(
    () =>
      props.columns.map(title => (
        <th key={title} className={props.firstExtended ? s['ds-table-column--extended'] : ''}>
          {title}
        </th>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <tr key={index}>
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
        <tbody>{Data}</tbody>
      </table>
      {props.data.length === 0 ? <Empty /> : null}
    </div>
  );
}
