import { DatePicker as DP, TimeRangePickerProps } from 'antd';
import s from './RangePicker.module.scss';
export type RangePickerProps = {};
export default function RangePicker(props: TimeRangePickerProps & RangePickerProps) {
  return <DP.RangePicker {...props} format={'DD/MM/YYYY'} className={s['ds-range-picker']} />;
}
