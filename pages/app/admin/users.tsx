import Button from "@/bases/Button/Button";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { useModal } from "@/contexts/modal.context";
import { Users as UsersIcon } from "react-feather";

export default function Users() {
  const modals = useModal();
  const { showInviteUsers } = modals.users;

  return (
    <>
      <Header icon={<UsersIcon />} title="Users">
        <Button theme="CTA" onClick={showInviteUsers}>
          Invite users
        </Button>
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
