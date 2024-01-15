import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Search as SearchIcon } from 'react-feather';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Search from '@/components/Search/Search';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function Repository() {
  const router = useRouter();

  useEffect(() => {}, [router]);

  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Page>
          <Search placeholder="Search articles..." onSearch={search => search} />
        </Page>
        {/* <Page></Page> */}
      </Wrapper>
    </>
  );
}
