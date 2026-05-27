import s from './Topbar.module.scss';

export default function Topbar() {
  return (
    <div className={s.topbar}>
      <div className={s.inner}>
        <span className={s.date}>Backoffice · Editorial workspace</span>
      </div>
    </div>
  );
}
