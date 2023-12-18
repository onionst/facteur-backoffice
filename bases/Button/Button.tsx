import { Spin } from "antd";
import s from "./Button.module.scss";
import { LoadingOutlined } from "@ant-design/icons";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = {
  children: any;
  theme: "CTA" | "SECONDARY" | "TERTIARY";
  loading?: boolean;
};

export default function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    ButtonProps
) {
  const theme = {
    CTA: "ds-btn--primary",
    SECONDARY: "ds-btn--secondary",
    TERTIARY: "ds-btn--tertiary",
  }[props.theme];
  return (
    <button
      disabled={props?.disabled || props?.loading}
      className={`btn ${props?.loading ? s["ds-btn--loading"] : s[theme]}`}
      {...props}
    >
      {props?.loading ? (
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: "#FFF" }} />
          }
        />
      ) : (
        props.children
      )}
    </button>
  );
}
