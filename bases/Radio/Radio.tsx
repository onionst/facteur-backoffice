import Row from '../Row/Row';
import s from './Radio.module.scss';
export type RadioProps = {
  onClick: () => void;
  checked?: boolean;
  label?: string;
  multiple?: boolean;
};
export default function Radio(props: RadioProps) {
  return (
    <div className={`c-pointer ${s['ds-radio__container']}`} onClick={props.onClick}>
      <Row align="LEFT">
        <button
          type="button"
          className={`${s['ds-radio']} ${props.checked ? s['ds-radio--selected'] : ''} ${props.multiple ? s['ds-radio--sq'] : ''} `}
        >
          {props.checked && <div />}
        </button>
        <label
          className={`${s['ds-radio-label']} ${props.checked ? s['ds-radio-label--selected'] : ''}  ${
            props.multiple ? s['ds-radio-label--sq'] : ''
          }`}
        >
          {props.label}
        </label>
      </Row>
    </div>
  );
}
