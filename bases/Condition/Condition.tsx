import { Check, X } from "react-feather";
import s from "./Condition.module.scss";

type ConditionProps = {
  state: "OK" | "PENDING" | "ERROR";
  children: string;
};

function Condition(props: ConditionProps) {
  const theme = {
    OK: {
      icon: <Check color="#FFF" />,
      cls: s["ds-condition--ok"],
    },
    PENDING: {
      icon: <Check color="" />,
      cls: s["ds-condition--pending"],
    },
    ERROR: {
      icon: <X color="#FFF" />,
      cls: s["ds-condition--error"],
    },
  }[props.state];

  return (
    <div>
      <div className={`ds-condition-theme`}></div>
    </div>
  );
}
