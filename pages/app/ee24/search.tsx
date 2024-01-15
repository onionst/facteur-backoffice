import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Download, Search as SearchIcon } from 'react-feather';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import Grid from '@/components/Grid/Grid';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
// import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function Repository() {
  const router = useRouter();
  useEffect(() => {}, [router]);
  // const handleSearch = () => {};

  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Page>
          <Search placeholder="Search articles..." onSearch={search => search} />
        </Page>
        <Grid size="25-75">
          <Page>
            <h5>Filter</h5>
          </Page>
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
