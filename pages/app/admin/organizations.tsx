import Button from "@/bases/Button/Button";
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
import { Box, Edit, RefreshCcw, X } from "react-feather";

export default function Organizations() {
  const modals = useModal();
  const { organizations, fetchOrganizations, page } = useOrganizations();
  const {
    showCreateOrganization,
    showEditOrganization,
    showDeleteOrganization,
    showRestoreOrganization,
  } = modals.organizations;

  return (
    <>
      <Header icon={<Box />} title={`Organizations`}>
        <Button theme="CTA" onClick={showCreateOrganization}>
          Create organization
        </Button>
      </Header>
      <Wrapper>
        <Page>
          <Search
            placeholder="Search organizations..."
            onSearch={(search) =>
              fetchOrganizations({
                search,
              })
            }
          />
        </Page>
        <Page>
          <Table
            columns={[
              "Name",
              "Domain",
              "State",
              <Row align="RIGHT" key={"column_actions"}>
                Actions
              </Row>,
            ]}
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
                  className={organization?.active ? "ds-badge-success" : ""}
                  key={organization?.id + organization?.active}
                  bg={organization?.active ? "success" : "danger"}
                >
                  {organization?.active ? "Active" : "Deleted"}
                </Badge>
              </div>,
              <Row align="RIGHT" key={organization?.id + "actions"}>
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
              </Row>,
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
      </Wrapper>
    </>
  );
}
