import { Check, X } from "react-feather";
import s from "./Condition.module.scss";
import { CSSProperties } from "react";

export type ConditionProps = {
  state: "OK" | "PENDING" | "ERROR";
  children: any;
  style?: CSSProperties;
};

export default function Condition(props: ConditionProps) {
  const theme = {
    OK: {
      icon: <Check color="#FFF" size={14} />,
      cls: s["ds-condition--ok"],
      text: s["ds-condition-text--ok"],
    },
    PENDING: {
      icon: <X color="#78829d" size={14} />,
      cls: s["ds-condition--pending"],
      text: s["ds-condition-text--pending"],
    },
    ERROR: {
      icon: <X color="#FFF" size={14} />,
      cls: s["ds-condition--error"],
      text: s["ds-condition-text--error"],
    },
  }[props.state];

  return (
    <div className={s["ds-condition"]} style={props?.style}>
      <div className={`${s["ds-condition-icon"]} ${theme.cls}`}>
        {theme.icon}
      </div>
      <span className={theme.text}>{props.children}</span>
    </div>
  );
}
