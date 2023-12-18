import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export type InputProps = {
  label?: string;
};

export function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    InputProps
) {
  return (
    <div>
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label}
        </label>
      )}
      <input className="form-control" {...props} />
    </div>
  );
}
