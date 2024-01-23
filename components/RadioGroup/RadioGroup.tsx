import { useEffect, useState } from 'react';
import s from './RadioGroup.module.scss';
import Radio from '@/bases/Radio/Radio';

export type RadioGroupProps = {
  options: Array<{
    label: string;
    value: string;
  }>;
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
  selected?: string;
};
export default function RadioGroup(props: RadioGroupProps) {
  const [selected, setSelected] = useState<string | string[]>('');

  useEffect(() => {
    props.onChange(selected);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (typeof props.selected === 'string') {
      setSelected(props.selected);
    }
  }, [props?.selected]);

  return (
    <div className={s['ds-radio-group']}>
      {props.options.map(option => (
        <Radio
          multiple={props.multiple}
          key={option.value}
          checked={props.multiple ? selected.includes(option.value) : selected === option.value}
          label={option.label}
          onClick={() => {
            if (props.multiple) {
              if (selected.includes(option.value)) {
                setSelected((prev: any) => prev.filter((i: string) => i != option.value));
              } else {
                setSelected((prev: any) => [...prev, option.value]);
              }
            } else {
              setSelected(prev => (prev === option.value ? '' : option.value));
            }
          }}
        />
      ))}
    </div>
  );
}
