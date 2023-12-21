import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Users as UsersIcon } from "react-feather";

export default function Users() {
  return (
    <>
      <Header icon={<UsersIcon />} title="Users" />
      <Wrapper>
        <Page>
          <Search placeholder="Search users..." onSearch={() => {}} />
        </Page>
        <Page>
          <Table columns={["Name", "Surname", "Email"]} data={[]} />
        </Page>
      </Wrapper>
    </>
  );
}
