import { Skeleton } from 'antd';
import { useState } from 'react';
import s from './Frame.module.scss';
export type FrameProps = { src: string };

export default function Frame(props: FrameProps) {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <div className={s['ds-frame-container']}>
      {loading && (
        <div className={s['ds-frame--loading']}>
          <div>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        </div>
      )}
      <iframe
        src={props.src}
        onLoad={() => {
          setLoading(false);
        }}
        className={s['ds-frame']}
      />
    </div>
  );
}
