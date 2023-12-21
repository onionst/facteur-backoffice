import { useMemo } from "react";
import s from "./Table.module.scss";
import { Empty } from "antd";
import Button from "@/bases/Button/Button";

export type TableProps = {
  columns: Array<any>;
  data: Array<Array<any>>;
};

export function Table(props: TableProps) {
  const Columns = useMemo(
    () => props.columns.map((title) => <th key={title}>{title}</th>),
    [props.columns]
  );

  const Data = useMemo(
    () =>
      props.data.map((data, index) => (
        <tr key={index}>
          {data.map((column, _index) => (
            <td className={s["ds-table-row__item"]} key={`${index}${_index}`}>
              {column}
            </td>
          ))}
        </tr>
      )),
    [props.data]
  );

  return (
    <div className={s["ds-table__container"]}>
      <table className={`table table-striped gy-7 gs-7 ${s["ds-table"]}`}>
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom border-gray-200">
            {Columns}
          </tr>
        </thead>
        <tbody>{Data}</tbody>
      </table>
      {props.data.length === 0 ? <Empty /> : null}
    </div>
  );
}
