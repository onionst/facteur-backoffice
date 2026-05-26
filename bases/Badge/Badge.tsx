import { HTMLAttributes, ReactNode } from 'react';
import s from './Badge.module.scss';

export type BadgeTone = 'neutral' | 'success' | 'warn' | 'danger' | 'info' | 'ink';

export type BadgeProps = {
  children?: ReactNode;
  tone?: BadgeTone;
} & HTMLAttributes<HTMLSpanElement>;

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: 'tone-neutral',
  success: 'tone-success',
  warn: 'tone-warn',
  danger: 'tone-danger',
  info: 'tone-info',
  ink: 'tone-ink'
};

export default function Badge({ children, tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span className={`${s.badge} ${s[TONE_CLASS[tone]]} ${className ?? ''}`} {...rest}>
      {children}
    </span>
  );
}
