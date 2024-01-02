import Image from "next/image";

export type LogoProps = {
  size: "S" | "M" | "L";
};
export default function Logo(props: LogoProps) {
  const height = {
    S: 24,
    M: 32,
    L: 38,
  }[props.size];
  return <Image src="/assets/icons/e-logo.svg" height={height} alt={""} />;
}
