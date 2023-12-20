import IconButton from "@/bases/IconButton/IconButton";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { useModal } from "@/contexts/modal.context";
import { useOrganizations } from "@/contexts/organizations.context";
import { Edit, X } from "react-feather";

export default function Organizations() {
  const { showCreateOrganization, showEditOrganization } = useModal();
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
              organization?.name,
              organization?.domain,
              organization?.active ? "Active" : "Unactive",
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 8,
                }}
                key={organization?.id}
              >
                <IconButton
                  onClick={() => showEditOrganization(organization?.id)}
                >
                  <Edit color="#252f4a" size={18} />
                </IconButton>
                <IconButton>
                  <X color="#252f4a" size={18} />
                </IconButton>
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
