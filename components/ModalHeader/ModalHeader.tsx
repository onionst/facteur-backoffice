import s from './ModalHeader.module.scss';

export type ModalHeaderProps = {
  subTitle: string;
  title: string;
  type?: 'DEFAULT' | 'ATTENTION';
};
export default function ModalHeader(props: ModalHeaderProps) {
  const style = {
    DEFAULT: '',
    ATTENTION: s['ds-modal-header--attention']
  }[props.type || 'DEFAULT'];
  return (
    <div className={`${s['ds-modal-header']} ${style}`}>
      <h5>{props.subTitle}</h5>
      <h3>{props.title}</h3>
    </div>
  );
}
