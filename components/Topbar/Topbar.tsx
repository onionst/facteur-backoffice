import s from './Topbar.module.scss';

export type TopbarProps = {
  meta?: string;
};

export default function Topbar({ meta = 'v0.1 · Prototype' }: TopbarProps) {
  return (
    <div className={s.topbar}>
      <div className={s.inner}>
        <span className={s.date}>Backoffice · Editorial workspace</span>
        <span className={s.meta}>{meta}</span>
      </div>
    </div>
  );
}
