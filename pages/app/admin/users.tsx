import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";

export default function Users() {
  return (
    <Wrapper>
      <Header>Users</Header>
      <Page>
        <Search
          cta="Create user"
          placeholder="Search users..."
          onCtaClick={() => {}}
        />
        <Table columns={["Name", "Surname", "Email"]} data={[]} />
      </Page>
    </Wrapper>
  );
}
