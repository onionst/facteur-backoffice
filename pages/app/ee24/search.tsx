import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Search as SearchIcon } from "react-feather";

export default function Repository() {
  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Page>
          <Search placeholder="Search articles..." onSearch={(search) => {}} />
        </Page>
        {/* <Page></Page> */}
      </Wrapper>
    </>
  );
}
