import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import s from './Button.module.scss';

export type ButtonProps = {
  children: any;
  theme: 'CTA' | 'SECONDARY' | 'TERTIARY' | 'ATTENTION';
  loading?: boolean;
};

export default function Button(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps) {
  const theme = {
    CTA: 'ds-btn--primary',
    SECONDARY: 'ds-btn--secondary',
    TERTIARY: 'ds-btn--tertiary',
    ATTENTION: 'ds-btn--attention'
  }[props.theme];

  const { loading, ...propsButton } = props;

  const isLoadingStyle = loading ? s['ds-btn--loading'] : s[theme];

  return (
    <button disabled={props?.disabled || loading} className={`btn ${isLoadingStyle}`} {...propsButton}>
      {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#FFF' }} />} /> : props.children}
    </button>
  );
}
