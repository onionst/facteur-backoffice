import s from './Switch.module.scss';

export type SwitchProps = { disabled?: boolean; checked?: boolean; onChange: (v: boolean) => void; left: string; right: string };

export default function Switch(props: SwitchProps) {
  return (
    <div className={`form-check form-switch form-check-custom form-check-solid ${s['ds-switch']}`}>
      <label className={props.checked ? '' : s['ds-switch--left']}>{props.left}</label>
      <input
        disabled={props.disabled}
        checked={props.checked}
        onChange={v => props?.onChange(v.target.checked)}
        className="form-check-input"
        type="checkbox"
        value=""
        id="flexSwitchDefault"
      />
      <label className={props.checked ? s['ds-switch--right'] : ''}>{props.right}</label>
    </div>
  );
}
