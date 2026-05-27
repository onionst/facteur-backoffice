import Link from 'next/link';
import { ReactNode } from 'react';
import s from './ArticleChrome.module.scss';

export type Crumb = {
  label: string;
  href?: string;
};

export type ArticleChromeProps = {
  crumbs: Crumb[];
  current: ReactNode;
  pager?: {
    current: number;
    total: number;
    onPrev?: () => void;
    onNext?: () => void;
  };
};

export default function ArticleChrome({ crumbs, current, pager }: ArticleChromeProps) {
  return (
    <div className={s.chrome}>
      <div className={s.crumbs}>
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className={s.crumbWrap}>
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            <span className={s.sep} aria-hidden="true">
              /
            </span>
          </span>
        ))}
        <strong>{current}</strong>
      </div>
      {pager && (
        <div className={s.pager} role="group" aria-label="Article queue navigation">
          <button
            type="button"
            className={s.pagerBtn}
            onClick={pager.onPrev}
            disabled={!pager.onPrev}
            aria-label="Previous article"
            title="Previous in queue"
          >
            ←
          </button>
          <span className={s.pagerCount} aria-live="polite">
            {pager.current} / {pager.total}
          </span>
          <button
            type="button"
            className={s.pagerBtn}
            onClick={pager.onNext}
            disabled={!pager.onNext}
            aria-label="Next article"
            title="Next in queue"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
