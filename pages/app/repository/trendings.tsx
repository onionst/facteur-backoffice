import { Skeleton } from 'antd';
import dayjs from 'dayjs';
import { TrendingUp } from 'react-feather';
import Column from '@/bases/Column/Column';
import Row from '@/bases/Row/Row';
import Header from '@/components/Header/Header';
import NotFound from '@/components/NotFound/NotFound';
import Page from '@/components/Page/Page';
import Trending from '@/components/Trending/Trending';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useTrendings } from '@/contexts/trendings.context';

export default function Trends() {
  const { trendings, lastModifiedAt, loading } = useTrendings();

  return (
    <>
      <Header icon={<TrendingUp />} title="Global disinformation trends on last 7 days">
        Last update: {dayjs(lastModifiedAt).format('DD/MM/YYYY HH:mm')}
      </Header>
      <Wrapper>
        <Column align="CENTER">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : trendings?.length > 0 ? (
            trendings.map((trending, index) => (
              <Trending
                key={index}
                narrative={trending.NARRATIVE}
                explanation={trending.EXPLANATION}
                position={index + 1}
                EXAMPLES={trending.EXAMPLES}
              />
            ))
          ) : (
            <Page>
              <Row align="CENTER">
                <div>
                  <NotFound title="Trends incoming..." description="Please, come back later" />
                </div>
              </Row>
            </Page>
          )}
        </Column>
      </Wrapper>
    </>
  );
}
