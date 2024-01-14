import s from './Segment.module.scss';

export type SegmentProps = {
  selected?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  onSelect: (value: string) => void;
};

export function Segment(props: SegmentProps) {
  return (
    <div className={`${s['ds-segment']}`} style={{ gridTemplateColumns: `repeat(${props.options.length},1fr)` }}>
      {props.options.map((option, index) => (
        <button
          className={option.value === props.selected ? s['ds-segment--selected'] : s['ds-segment--unselected']}
          key={index}
          type="button"
          onClick={() => props.onSelect(option.value)}
        >
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
