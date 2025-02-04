import { Select, SelectProps } from 'antd';
import s from './Tagger.module.scss';

export type TaggerProps = { label: string; required?: boolean };
export default function Tagger(props: SelectProps & TaggerProps) {
  return (
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required ? <span>*</span> : ''}
        </label>
      )}
      <div className="w-full" style={{ position: 'relative' }}>
        <Select
          {...props}
          optionFilterProp="label"
          notFoundContent={null}
          tokenSeparators={[',']}
          className={s['ds-tagger__input']}
        ></Select>
      </div>
      <input
        type="text"
        value={props?.value?.join(',')}
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
