import dayjs from 'dayjs';
import { TrendingUp } from 'react-feather';
import Column from '@/bases/Column/Column';
import Header from '@/components/Header/Header';
import Trending from '@/components/Trending/Trending';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useTrendings } from '@/contexts/trendings.context';

export default function Trends() {
  const { trendings } = useTrendings();

  return (
    <>
      <Header icon={<TrendingUp />} title="Trendings">
        Last update: {dayjs().startOf('day').format('DD/MM/YYYY HH:mm')}
      </Header>
      <Wrapper>
        <Column align="CENTER">
          {trendings.map((trending, index) => (
            <Trending
              key={index}
              narrative={trending.NARRATIVE}
              explanation={trending.EXPLANATION}
              position={index + 1}
              EXAMPLES={trending.EXAMPLES}
            />
          ))}
        </Column>
      </Wrapper>
    </>
  );
}
