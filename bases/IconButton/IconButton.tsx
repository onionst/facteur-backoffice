import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import s from './IconButton.module.scss';

export type IconButtonProps = { children: ReactNode; loading?: boolean };

export default function IconButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & IconButtonProps) {
  return (
    <button {...props} disabled={props.loading || props.disabled} className={s['ds-icon-button']}>
      {props.loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: '#FFF' }} />} /> : props.children}
    </button>
  );
}
