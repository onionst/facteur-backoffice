import s from './DatePicker.module.scss';
import { DatePicker as DP, DatePickerProps } from 'antd';

export type InputProps = {
  label?: string;
  required?: boolean;
};

export function DatePicker(props: DatePickerProps & InputProps) {
  return (
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required ? <span>*</span> : ''}
        </label>
      )}
      <div className="w-full" style={{ position: 'relative' }}>
        <DP
          {...props}
          // @ts-ignore
          showToday={false}
          className={`form-control ${s['ds-date-picker']} ${props.className || ''}`}
        />
      </div>
    </div>
  );
}
