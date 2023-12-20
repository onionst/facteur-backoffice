import IconButton from "@/bases/IconButton/IconButton";
import Row from "@/bases/Row/Row";
import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Pagination from "@/components/Pagination/Pagination";
import Search from "@/components/Search/Search";
import { Table } from "@/components/Table/Table";
import Wrapper from "@/components/Wrapper/Wrapper";
import { useModal } from "@/contexts/modal.context";
import {
  ORGANIZATIONS_LIMIT_PER_PAGE,
  useOrganizations,
} from "@/contexts/organizations.context";
import { Badge } from "react-bootstrap";
import { Edit, RefreshCcw, X } from "react-feather";

export default function Organizations() {
  const {
    showCreateOrganization,
    showEditOrganization,
    showDeleteOrganization,
    showRestoreOrganization,
  } = useModal();
  const { organizations, fetchOrganizations, page } = useOrganizations();

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
              fetchOrganizations({
                search,
              })
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
                    <RefreshCcw color="#252f4a" size={18} />
                  </IconButton>
                )}
              </div>,
            ])}
          />
        </Page>
        <Row align="SPACE">
          <span>
            Showing {organizations.length} of {page.records} organizations
          </span>
          <Pagination
            limit={ORGANIZATIONS_LIMIT_PER_PAGE}
            currentPage={page.current}
            totalRecordsCount={page.records}
            prevPage={() => {
              fetchOrganizations({}, page.current - 1 - 1);
            }}
            nextPage={() => {
              fetchOrganizations({}, page.current - 1 + 1);
            }}
            skip={(page) => fetchOrganizations({}, page - 1)}
          />
        </Row>
        {/* </Page> */}
      </Wrapper>
    </>
  );
}
