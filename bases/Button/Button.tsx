import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import s from './Button.module.scss';

export type ButtonTheme = 'CTA' | 'SECONDARY' | 'TERTIARY' | 'ATTENTION';
export type ButtonSize = 'SM';

export type ButtonProps = {
  children: any;
  theme: ButtonTheme;
  size?: ButtonSize;
  loading?: boolean;
};

const THEME_CLASS: Record<ButtonTheme, string> = {
  CTA: 'ds-btn--primary',
  SECONDARY: 'ds-btn--secondary',
  TERTIARY: 'ds-btn--tertiary',
  ATTENTION: 'ds-btn--attention'
};

/* CTA uses dark text on a mint background; everything else uses ink text — keep
   the spinner ink so it stays visible on whichever palette. */
const SPIN_COLOR = '#0A0A0A';

export default function Button(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps) {
  const { loading, disabled, theme, size, className, ...rest } = props;

  const classes = [
    s['btn-base'],
    s[THEME_CLASS[theme]],
    size === 'SM' ? s['ds-btn--sm'] : '',
    loading ? s['ds-btn--loading'] : '',
    className ?? ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button disabled={disabled || loading} className={classes} {...rest}>
      {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: SPIN_COLOR }} />} /> : props.children}
    </button>
  );
}
