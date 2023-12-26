import Button from "@/bases/Button/Button";
import IconButton from "@/bases/IconButton/IconButton";
import Row from "@/bases/Row/Row";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Pagination from "@/components/Pagination/Pagination";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { ROLES } from "@/constants/roles.constants";
import { useAuth } from "@/contexts/auth.context";
import { useModal } from "@/contexts/modal.context";
import { useOrganizations } from "@/contexts/organizations.context";
import { USERS_LIMIT_PER_PAGE, useUsers } from "@/contexts/users.context";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Edit, Mail, RefreshCcw, Users as UsersIcon, X } from "react-feather";

export default function Users() {
  const modals = useModal();
  const [filter, setFilter] = useState({});
  const [organizations, setOrganizations] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const { session } = useAuth();
  const { users, fetchUsers, page } = useUsers();
  const { listOrganizations } = useOrganizations();
  const { showInviteUsers } = modals.users;

  const handleListOrganization = async () => {
    setOrganizations([
      {
        value: "",
        label: "Filter by organization",
      },
      ...(await listOrganizations()).map((organization) => ({
        value: organization?.id || "",
        label: organization?.name || "",
      })),
    ]);
  };

  useEffect(() => {
    if (session.role === ROLES.SUPER_ADMIN) {
      handleListOrganization();
    }
  }, [session]);

  return (
    <>
      <Header icon={<UsersIcon />} title="Users">
        <Button theme="CTA" onClick={showInviteUsers}>
          Invite users
        </Button>
      </Header>
      <Wrapper>
        <Page>
          <Search
            placeholder="Search users..."
            onSearch={(search, organizationId) => {
              if (organizationId || session.role != ROLES.SUPER_ADMIN) {
                fetchUsers({
                  surname: search,
                  name: search,
                  email: search,
                  organizationId:
                    session.role === ROLES.SUPER_ADMIN
                      ? organizationId
                      : session.organizationId,
                });
              } else {
                fetchUsers({
                  surname: search,
                  name: search,
                  email: search,
                });
              }
            }}
            withSelector={
              session.role === ROLES.SUPER_ADMIN ? organizations : undefined
            }
          />
        </Page>
        <Page>
          <Table
            columns={[
              "Email",
              "Name",
              "Surname",
              "State",
              <Row align="RIGHT" key={"column_actions"}>
                Actions
              </Row>,
            ]}
            data={users.map((user) => [
              user?.email,
              user?.name || "-",
              user?.surname || "-",
              <div key={user?.id + "state"}>
                <Badge
                  className={user?.name ? "ds-badge-success" : ""}
                  key={user?.id + user?.active}
                  bg={user?.name ? (user?.active ? "" : "danger") : "secondary"}
                >
                  {user?.name
                    ? user?.active
                      ? "Active"
                      : "Deleted"
                    : "Pending"}
                </Badge>
              </div>,
              <Row align="RIGHT" key={user?.id + "actions"}>
                {user?.name ? (
                  user?.active ? (
                    <>
                      <IconButton onClick={() => {}}>
                        <Edit color="#252f4a" size={18} />
                      </IconButton>
                      <IconButton onClick={() => {}}>
                        <X color="#252f4a" size={18} />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => {}}>
                      <RefreshCcw color="#252f4a" size={18} />
                    </IconButton>
                  )
                ) : (
                  <>
                    <IconButton>
                      <Mail color="#252f4a" size={18} />
                    </IconButton>
                    <IconButton>
                      <X color="#252f4a" size={18} />
                    </IconButton>
                  </>
                )}
              </Row>,
            ])}
          />
        </Page>
        <Row align="SPACE">
          <span>
            Showing {users.length} of {page.records} users
          </span>
          <Pagination
            limit={USERS_LIMIT_PER_PAGE}
            currentPage={page.current + 1}
            totalRecordsCount={page.records}
            prevPage={() => {
              fetchUsers({}, page.current);
            }}
            nextPage={() => {
              fetchUsers({}, page.current + 1 + 1);
            }}
            skip={(page) => fetchUsers({}, page)}
          />
        </Row>
      </Wrapper>
    </>
  );
}
