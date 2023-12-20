import s from "./ModalHeader.module.scss";

export type ModalHeaderProps = {
  subTitle: string;
  title: string;
};
export default function ModalHeader(props: ModalHeaderProps) {
  return (
    <div className={s["ds-modal-header"]}>
      <h5>{props.subTitle}</h5>
      <h3>{props.title}</h3>
    </div>
  );
}
