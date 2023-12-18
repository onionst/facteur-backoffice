import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";

export default function Organizations() {
  return (
    <>
      <Wrapper>
        <Header>Organizations</Header>
        <Page>
          <Search
            cta="Create organization"
            onCtaClick={() => {}}
            placeholder="Search organizations..."
          />
          <Table
            columns={["Name", "Domain"]}
            data={[["Newtral", "newtral.es"]]}
          />
        </Page>
      </Wrapper>
    </>
  );
}
