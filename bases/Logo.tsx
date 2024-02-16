import Image from 'next/image';

export type LogoProps = {
  size: 'S' | 'M' | 'L';
};
export default function Logo(props: LogoProps) {
  const height = {
    S: 48,
    M: 56,
    L: 64
  }[props.size];

  const width = height * 2;

  return <Image src="/assets/icons/e-logo.svg" height={height} width={width} alt={'EFCSN logo'} />;
}
