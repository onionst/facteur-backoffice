import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Download, Search as SearchIcon } from 'react-feather';
import Column from '@/bases/Column/Column';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import EE24Filter, { Filter } from '@/components/EE24Filter/EE24Filter';
import Grid from '@/components/Grid/Grid';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { FILE_TYPES } from '@/constants/accept';
import { EE24_ARTICLES_LIMIT_PER_PAGE, useEE24 } from '@/contexts/ee24.context';
import { useModal } from '@/contexts/modal.context';

export default function Repository() {
  const modals = useModal();
  const router = useRouter();
  const { articles, page, fetchEE24Articles, ...ee24Props } = useEE24();
  const { showDownloadEE24Articles } = modals.ee24;
  const [key, setKey] = useState(Date.now());
  const [filter, setFilter] = useState<Filter & { search: string }>({ search: '' });

  useEffect(() => {
    if (router?.query?.c && router.query.q && typeof router.query.q === 'string') {
      if (router.query.c === 'TEXT') {
        setFilter({ search: router.query.q });
      } else {
        setFilter({ search: '' });
      }
    }
  }, [router]);

  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Grid size="20-80">
          <div className="p-rel">
            <EE24Filter
              key={key}
              reset={() => {
                setKey(Date.now());
                setFilter(prev => ({
                  search: prev?.search
                }));
              }}
              filter={filter}
              onSubmit={() => {
                fetchEE24Articles(filter);
              }}
              onChange={(data: Filter) => {
                setFilter(prev => ({
                  ...data,
                  search: prev.search
                }));
              }}
            />
          </div>
          <Column align="LEFT">
            <Page>
              <Search
                withUploader
                accept={{
                  'image/*': FILE_TYPES.images,
                  'video/*': FILE_TYPES.videos,
                  'audio/*': FILE_TYPES.audio
                }}
                onUpload={() => {}}
                defaultValue={filter.search}
                placeholder="Search articles..."
                onSearch={search => {
                  setFilter(prev => ({ ...prev, search }));
                  fetchEE24Articles(filter);
                }}
              />
            </Page>
            <Page>
              <Table
                firstExtended
                loading={ee24Props.loading}
                columns={['Headline', 'URL', 'Date modified']}
                data={articles.map(article => [
                  article?.headline,
                  <Link target="_blank" href={article?.url} key={article?.externalId + 'link'}>
                    {article?.url}
                  </Link>,
                  dayjs(article?.dateModified).format('DD/MM/YYYY')
                ])}
              />
            </Page>
          </Column>
        </Grid>
        <Row align="SPACE">
          <Row align="LEFT">
            <IconButton type="button" onClick={showDownloadEE24Articles}>
              <Download color="#252f4a" size={16} />
            </IconButton>
            <span>
              Showing {articles.length} of {page.records} articles
            </span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              limit={EE24_ARTICLES_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchEE24Articles(filter, page.current);
              }}
              nextPage={() => {
                fetchEE24Articles(filter, page.current + 1 + 1);
              }}
              skip={skip => fetchEE24Articles(filter, skip)}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
