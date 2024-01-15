import s from './Grid.module.scss';
export type GridProps = {
  children: any;
  size: '20-80' | '25-75' | '30-70' | '40-60' | '50-50' | '60-40' | '70-30' | '80-20';
};
export default function Grid(props: GridProps) {
  return <div className={s[`ds-grid-${props.size}`]}>{props.children}</div>;
}
