import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';

export type ImageProps = {
  defaultImage?: string;
};

export default function Image(props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & ImageProps) {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    setSrc(props.src || props.defaultImage || '/assets/portraits/image.svg');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={src} onError={() => setSrc(props.defaultImage || '/assets/portraits/image.svg')} />;
}
