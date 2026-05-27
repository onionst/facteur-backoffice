import { HTMLAttributes } from 'react';
import s from './Avatar.module.scss';

export type AvatarProps = {
  name?: string;
  surname?: string;
  size?: number;
} & HTMLAttributes<HTMLSpanElement>;

function initials(name?: string, surname?: string): string {
  const a = name?.trim()?.[0] ?? '';
  const b = surname?.trim()?.[0] ?? '';
  return (a + b).toUpperCase() || '·';
}

export default function Avatar({ name, surname, size = 32, className, style, ...rest }: AvatarProps) {
  const dimension = `${size}px`;
  const fontSize = `${Math.max(11, Math.round(size * 0.4))}px`;
  return (
    <span
      className={`${s.avatar} ${className ?? ''}`.trim()}
      style={{ width: dimension, height: dimension, fontSize, ...style }}
      {...rest}
    >
      {initials(name, surname)}
    </span>
  );
}
