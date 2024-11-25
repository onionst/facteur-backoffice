import Image from 'next/image';

export type LogoProps = {
  size: 'S' | 'M' | 'L';
};
export default function Logo(props: LogoProps) {
  const height = {
    S: 24,
    M: 52,
    L: 68
  }[props.size];

  const width = height * 2;

  return <Image src="/assets/icons/e-logo-legacy.svg" height={height} width={width} alt={'EFCSN logo'} />;
}
