import { DetailedHTMLProps, VideoHTMLAttributes } from 'react';

export type VideoProps = {};
export default function Video(props: VideoProps & DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) {
  return <video {...props} src={props.src} autoPlay loop muted />;
}
