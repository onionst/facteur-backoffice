import { ReactNode } from 'react';
import s from './ArticleStatus.module.scss';

export type ArticleStatusProps = {
  state: string;
  fieldsToReview?: number;
  version: string;
  actions?: ReactNode;
};

export default function ArticleStatus({ state, fieldsToReview, version, actions }: ArticleStatusProps) {
  return (
    <div className={s.status}>
      <div className={s.left}>
        <span className={`${s.pill} ${s.pillState}`}>{state}</span>
        {typeof fieldsToReview === 'number' && fieldsToReview > 0 && (
          <span className={`${s.pill} ${s.pillFields}`}>
            <span className={s.dot} />
            {fieldsToReview} fields need review
          </span>
        )}
      </div>
      <div className={s.right}>
        <span className={s.versionTag}>
          <span>{version}</span>
          <span className={s.versionDot} aria-hidden="true" />
        </span>
        <button type="button" className={s.versionSelector} aria-haspopup="listbox" title="Switch to a previous version">
          <span>Version</span>
          <span className={s.arrow}>▾</span>
        </button>
        {actions}
      </div>
    </div>
  );
}
