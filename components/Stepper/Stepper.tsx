import { Check } from 'react-feather';
import s from './Stepper.module.scss';
export type StepperProps = {
  current: number;
  items: Array<{ title: string; description: string }>;
};
export default function Stepper(props: StepperProps) {
  return (
    <div className={s['ds-stepper']}>
      {props.items.map((step, position) => (
        <div
          key={position}
          className={`${s['ds-stepper__item']} ${
            position === props.current ? s['ds-stepper__item--active'] : props.current > position ? s['ds-stepper__item--passed'] : ''
          }`}
        >
          <div className={s['ds-stepper__item-position']}>
            <span>{props.current > position ? <Check size={16} color="#252f4a" /> : position + 1}</span>
          </div>
          <div className={s['ds-stepper__item-text']}>
            <h6>{step.title}</h6>
            {step.description && <span>{step.description}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
