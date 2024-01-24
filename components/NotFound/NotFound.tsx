import { Empty } from 'antd';
import s from './NotFound.module.scss';

export type NotFoundProps = {
  title: string;
  description: string;
};

export default function NotFound(props: NotFoundProps) {
  return (
    <div className={s['ds-not-found']}>
      <Empty description="" />
      <div className={s['ds-not-found__text']}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    </div>
  );
}
