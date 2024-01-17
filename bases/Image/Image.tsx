/* eslint-disable jsx-a11y/alt-text */
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';
import s from './Image.module.scss';

export type ImageProps = {
  defaultImage?: string;
  alt: string;
};

export default function Image(props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & ImageProps) {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    setSrc(props.src || props.defaultImage || '/assets/portraits/image.svg');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className={`${s['ds-image']} ${props.className || ''}`}
      src={src}
      onError={() => setSrc(props.defaultImage || '/assets/portraits/image.svg')}
    />
  );
}
