import { ReactNode } from "react";
import s from "./IconButton.module.scss";

export type IconButtonProps = { children: ReactNode };

export default function IconButton(props: IconButtonProps) {
  return <button className={s["ds-icon-button"]}>{props.children}</button>;
}
