import Link from 'next/link';
import { Maximize2 } from 'react-feather';
import s from './Banner.module.scss';
import IconButton from '@/bases/IconButton/IconButton';
import Image from '@/bases/Image/Image';

export type BannerProps = { src: string };

export default function Banner(props: BannerProps) {
  return (
    <div className={s['ds-banner']}>
      <div className={s['ds-banner__max']}>
        <Link target="_blank" href={props.src}>
          <IconButton type="button">
            <Maximize2 color="#252f4a" size={18} />
          </IconButton>
        </Link>
      </div>
      <Image
        alt="ee24"
        style={{ width: '100%', height: 160, minHeight: 160, maxHeight: 160, minWidth: '100%', maxWidth: '100%', objectFit: 'cover' }}
        src={props.src}
      />
    </div>
  );
}
