import Row from '../Row/Row';
import s from './Radio.module.scss';
export type RadioProps = {
  onClick: () => void;
  checked?: boolean;
  label?: string;
};
export default function Radio(props: RadioProps) {
  return (
    <div className="c-pointer" onClick={props.onClick}>
      <Row align="LEFT">
        <button className={`${s['ds-radio']} ${props.checked ? s['ds-radio--selected'] : ''}`}>{props.checked && <div />}</button>
        <label className={`${s['ds-radio-label']} ${props.checked ? s['ds-radio-label--selected'] : ''}`}>{props.label}</label>
      </Row>
    </div>
  );
}
