export type ModalHeaderProps = {
  subTitle: string;
  title: string;
  description: string;
};
export default function ModalHeader(props: ModalHeaderProps) {
  return (
    <div>
      <h5>{props.subTitle}</h5>
      <h3>{props.title}</h3>
    </div>
  );
}
