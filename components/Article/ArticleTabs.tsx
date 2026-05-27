import s from './ArticleTabs.module.scss';

export type ArticleTab = {
  key: string;
  label: string;
  count?: number;
  countTone?: 'default' | 'warn';
};

export type ArticleTabsProps = {
  tabs: ArticleTab[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function ArticleTabs({ tabs, activeKey, onChange }: ArticleTabsProps) {
  return (
    <div className={s.tabs} role="tablist" aria-label="Article detail sections">
      {tabs.map(t => {
        const isActive = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${s.tab} ${isActive ? s.active : ''}`.trim()}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span className={`${s.count} ${t.countTone === 'warn' ? s.countWarn : ''}`.trim()}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
