import { File } from 'react-feather';
import Button from '@/bases/Button/Button';
import Header from '@/components/Header/Header';
import Page from '@/components/Page/Page';
import Search from '@/components/Search/Search';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function Articles() {
  return (
    <>
      <Header icon={<File />} title="Articles">
        <Button theme="CTA">Create article</Button>
      </Header>
      <Wrapper>
        <Page>
          <Search placeholder="Search articles..." onSearch={() => {}} />
        </Page>
        {/* <Page></Page> */}
      </Wrapper>
    </>
  );
}
