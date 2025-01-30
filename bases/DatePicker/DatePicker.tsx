import { DatePicker as DP, DatePickerProps } from 'antd';
import s from './DatePicker.module.scss';

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
          format={'DD/MM/YYYY'}
          className={`form-control ${props.disabled ? s['ds-date-picker--disabled'] : s['ds-date-picker']} ${props.className || ''}`}
        />
      </div>
      <input
        type="text"
        value={props?.value ? props?.value?.toISOString() : ''}
        required={props.required}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
