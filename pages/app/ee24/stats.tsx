import { BarChart2 } from 'react-feather';
import Frame from '@/components/Frame/Frame';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';
import { SETTINGS } from '@/constants/settings';

export default function Stats() {
  return (
    <>
      <Header icon={<BarChart2 />} title="Statistics" />
      <Wrapper>
        <Frame src={SETTINGS.PUBLIC_STATS_URL} />
      </Wrapper>
    </>
  );
}
