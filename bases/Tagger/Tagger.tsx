import { Tag } from 'antd';
import s from './Tagger.module.scss';
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from 'react';

export type TaggerProps = { label: string; required?: boolean };
export default function Tagger(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & TaggerProps) {
  const [v, setV] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (v.includes(',')) {
      const trim = (
        v
          .split('')
          .slice(0, v.split('').length - 1)
          .join('') || ''
      ).trim();
      if (trim) {
        setTags(prev => [...prev, trim]);
        setV('');
      }
    }
  }, [v]);

  return (
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required ? <span>*</span> : ''}
        </label>
      )}
      <div className="w-full" style={{ position: 'relative' }}>
        <input
          {...props}
          onBlur={() => {
            if (v) {
              setTags(prev => [...prev, v]);
              setV('');
            }
          }}
          value={v}
          onChange={v => setV(v.target.value)}
          className={`form-control ${props.className || ''}`}
        />
        <div className={s['ds-tagger__tags']}>
          {tags.map(tag => (
            <Tag closable>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
