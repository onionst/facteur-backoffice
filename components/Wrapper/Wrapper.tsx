import s from "./Wrapper.module.scss";
export type WrapperProps = { children: any };
export default function Wrapper(props: WrapperProps) {
  return <div className={s["ds-wrapper"]}>{props.children}</div>;
}
