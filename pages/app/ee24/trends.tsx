import { TrendingUp } from 'react-feather';
import Frame from '@/components/Frame/Frame';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';
import { SETTINGS } from '@/constants/settings';

export default function Trends() {
  return (
    <>
      <Header icon={<TrendingUp />} title="Trends" />
      <Wrapper>
        <Frame src={SETTINGS.PUBLIC_TRENDS_URL} />
      </Wrapper>
    </>
  );
}
