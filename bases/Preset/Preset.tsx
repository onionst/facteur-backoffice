import s from './Preset.module.scss';
export type PresetProps = { title: string; value: string };
export function Preset(props: PresetProps) {
  return (
    <div className={s['ds-preset']}>
      <h6>{props.title}</h6>
      <span>{props.value}</span>
    </div>
  );
}
