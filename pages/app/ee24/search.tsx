import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Search as SearchIcon } from "react-feather";

export default function Search() {
  return (
    <>
      <Header icon={<SearchIcon />} title="EE24 Repository" />
      <Wrapper>
        <Page>{/*  */}</Page>
      </Wrapper>
    </>
  );
}
