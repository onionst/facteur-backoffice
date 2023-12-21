import Button from "@/bases/Button/Button";
import Select from "@/bases/Select";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { ROLES } from "@/constants/roles.constants";
import { useAuth } from "@/contexts/auth.context";
import { Users as UsersIcon } from "react-feather";

export default function Users() {
  const { session } = useAuth();
  return (
    <>
      <Header icon={<UsersIcon />} title="Users">
        <Button theme="CTA">Create user</Button>
      </Header>
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
