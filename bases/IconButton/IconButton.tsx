import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import s from './IconButton.module.scss';

export type IconButtonProps = { children: ReactNode };

export default function IconButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & IconButtonProps) {
  return (
    <button className={s['ds-icon-button']} {...props}>
      {props.children}
    </button>
  );
}
