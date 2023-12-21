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
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required ? <span>*</span> : ""}
        </label>
      )}
      <input {...props} className={`form-control ${props.className || ""}`} />
    </div>
  );
}
