/* eslint-disable jsx-a11y/alt-text */
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';
import s from './Image.module.scss';
import { FileType } from '@/components/EE24Search/EE24Search';
import { FILE_TYPES } from '@/constants/accept';

export type ImageProps = {
  defaultImage?: string;
  alt: string;
  src?: string;
};

export default function Image(props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & ImageProps) {
  const [defaultPortrait, setDefaultPortrait] = useState<string>('/assets/portraits/image.svg');

  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    const url = props.src || '';
    let portraitType: FileType = 'NONE';
    FILE_TYPES.images.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'IMAGE';
      }
    });
    FILE_TYPES.audio.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'AUDIO';
      }
    });
    FILE_TYPES.videos.forEach(ext => {
      if (url.includes(ext)) {
        portraitType = 'VIDEO';
      }
    });
    // eslint-disable-next-line no-shadow
    const portrait = {
      NONE: '',
      IMAGE: url,
      AUDIO: '/assets/portraits/audio.svg',
      VIDEO: '/assets/portraits/video.svg'
    }[portraitType];
    setDefaultPortrait(portrait);

    // @ts-ignore
    if (portraitType != 'IMAGE') {
      setSrc(portrait);
    } else {
      setSrc(props.src || portrait || props.defaultImage || '/assets/portraits/image.svg');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className={`${s['ds-image']} ${props.className || ''}`}
      src={src || defaultPortrait}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = '/assets/portraits/image.svg';
      }}
    />
  );
}
