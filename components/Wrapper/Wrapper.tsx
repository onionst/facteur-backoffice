import { CSSProperties } from 'react';
import s from './Wrapper.module.scss';
import useWindowSize from '@/hooks/useWindowWidth';
export type WrapperProps = { children: any; style?: CSSProperties };
export default function Wrapper(props: WrapperProps) {
  const { width } = useWindowSize();

  if (width < 768) {
    return (
      <div className={s['ds-wrapper__mobile']} style={props.style}>
        {props.children}
      </div>
    );
  }
  return (
    <div className={s['ds-wrapper']} style={props.style}>
      {props.children}
    </div>
  );
}
