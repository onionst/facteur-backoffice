import Gravatar from 'react-gravatar';
import s from './Banner.module.scss';

export type BannerProps = { id?: string };

export default function Banner(props: BannerProps) {
  return (
    <div className={s['ds-banner']}>
      <Gravatar size={2048} height={'auto'} width={'100%'} email={`${props.id}@efcsn.com`} />
    </div>
  );
}
