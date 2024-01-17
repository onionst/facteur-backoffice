import s from './Frame.module.scss';
export type FrameProps = { src: string };

export default function Frame(props: FrameProps) {
  return <iframe src={props.src} className={s['ds-frame']} />;
}
