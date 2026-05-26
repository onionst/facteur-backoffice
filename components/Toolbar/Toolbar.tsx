import { HTMLAttributes, ReactNode } from 'react';
import s from './Toolbar.module.scss';

export type ToolbarProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export default function Toolbar({ children, className, ...rest }: ToolbarProps) {
  return (
    <div className={`${s.toolbar} ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className={s.divider} aria-hidden="true" />;
}
