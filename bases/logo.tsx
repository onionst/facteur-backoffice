export type LogoProps = {
  size: "S" | "M" | "L";
};
export default function Logo(props: LogoProps) {
  const height = {
    S: 26,
    M: 32,
    L: 38,
  }[props.size];
  return <img src="/assets/icons/e-logo.svg" height={height} />;
}
