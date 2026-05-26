import s from './FilterChips.module.scss';

export type FilterChipOption<T extends string = string> = {
  value: T;
  label: string;
  count?: number;
};

export type FilterChipsProps<T extends string = string> = {
  options: Array<FilterChipOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

export default function FilterChips<T extends string = string>(props: FilterChipsProps<T>) {
  const { options, value, onChange, ariaLabel = 'Filter' } = props;

  return (
    <div className={s.group} role="tablist" aria-label={ariaLabel}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${s.chip} ${active ? s.active : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && <span className={s.count}>{opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
