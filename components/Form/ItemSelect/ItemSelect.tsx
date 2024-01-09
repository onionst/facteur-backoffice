import s from './ItemSelect.module.scss';
export type ItemSelectProps = { icon: any; label: string; onClick: () => void };
export default function ItemSelect(props: ItemSelectProps) {
  return (
    <button type="button" className={s['ds-item-select']} onClick={props.onClick}>
      <div>{props.icon}</div>
      <span>{props.label}</span>
    </button>
  );
}
