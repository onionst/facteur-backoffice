import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Download, Search as SearchIcon } from 'react-feather';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import EE24Filter, { Filter } from '@/components/EE24Filter/EE24Filter';
import Grid from '@/components/Grid/Grid';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
// import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function Repository() {
  const router = useRouter();
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
        <Page>
          <Search placeholder="Search articles..." onSearch={search => search} />
        </Page>
        <Grid size="20-80">
          <EE24Filter
            filter={filter}
            onSubmit={() => {}}
            onChange={(data: Filter) => {
              setFilter(prev => ({
                ...data,
                search: prev.search
              }));
            }}
          />
          <Page>
            <Table columns={[]} data={[]} />
          </Page>
        </Grid>
        <Row align="SPACE">
          <Row align="LEFT">
            <IconButton type="button" onClick={() => {}}>
              <Download color="#252f4a" size={16} />
            </IconButton>
            <span>Showing _ of _ articles</span>
          </Row>
          <Row align="RIGHT">
            {/* <Pagination
              limit={USERS_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchUsers(filter, page.current);
              }}
              nextPage={() => {
                fetchUsers(filter, page.current + 1 + 1);
              }}
              skip={skip => fetchUsers(filter, skip)}
            /> */}
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
