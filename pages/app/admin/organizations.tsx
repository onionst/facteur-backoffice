import IconButton from "@/bases/IconButton/IconButton";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { useModal } from "@/contexts/modal.context";
import { useOrganizations } from "@/contexts/organizations.context";
import { Badge } from "react-bootstrap";
import { CornerDownLeft, Edit, X } from "react-feather";

export default function Organizations() {
  const {
    showCreateOrganization,
    showEditOrganization,
    showDeleteOrganization,
    showRestoreOrganization,
  } = useModal();
  const { organizations, fetchOrganizations } = useOrganizations();
  return (
    <>
      <Wrapper>
        <Header>Organizations</Header>
        <Page>
          <Search
            cta="Create organization"
            onCtaClick={showCreateOrganization}
            placeholder="Search organizations..."
            onSearch={(search) =>
              fetchOrganizations({ search, skip: 0, limit: 20 })
            }
          />
          <Table
            columns={["Name", "Domain", "State"]}
            data={organizations.map((organization) => [
              <span
                key={organization?.id + "name"}
                style={{ opacity: organization?.active ? 1 : 0.6 }}
              >
                {organization?.name}
              </span>,
              <span
                key={organization?.id + "domain"}
                style={{ opacity: organization?.active ? 1 : 0.6 }}
              >
                {organization?.domain}
              </span>,
              <div key={organization?.id + "state"}>
                <Badge
                  key={organization?.id + organization?.active}
                  bg={organization?.active ? "secondary" : "danger"}
                >
                  {organization?.active ? "Active" : "Unactive"}
                </Badge>
              </div>,
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 8,
                }}
                key={organization?.id + "actions"}
              >
                {organization?.active ? (
                  <>
                    <IconButton
                      onClick={() => showEditOrganization(organization?.id)}
                    >
                      <Edit color="#252f4a" size={18} />
                    </IconButton>
                    <IconButton
                      onClick={() => showDeleteOrganization(organization?.id)}
                    >
                      <X color="#252f4a" size={18} />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    onClick={() => showRestoreOrganization(organization?.id)}
                  >
                    <CornerDownLeft color="#252f4a" size={18} />
                  </IconButton>
                )}
              </div>,
            ])}
            // data={[
            //   [
            //     "Newtral",
            //     "newtral.es",

            //   ],
            // ]}
          />
        </Page>
      </Wrapper>
    </>
  );
}
