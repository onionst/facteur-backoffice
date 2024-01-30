import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Box, Download, Edit, RefreshCcw, Trash } from 'react-feather';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import { Sorter } from '@/bases/Sorter/Sorter';
import Header from '@/components/Header/Header';
import NotFound from '@/components/NotFound/NotFound';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useModal } from '@/contexts/modal.context';
import { ORGANIZATIONS_LIMIT_PER_PAGE, useOrganizations } from '@/contexts/organizations.context';
import { safeReturn } from '@/utils/safeReturn';

export default function Organizations() {
  const modals = useModal();
  const [filter, setFilter] = useState<any>({
    order: 'DESC',
    orderBy: 'creationDate'
  });
  const { organizations, fetchOrganizations, page, ...organizationsProps } = useOrganizations();
  const { showCreateOrganization, showEditOrganization, showDeleteOrganization, showRestoreOrganization, showDownloadOrganizations } =
    modals.organizations;

  useEffect(() => {
    return () => {
      safeReturn(() =>
        fetchOrganizations({
          order: 'DESC',
          orderBy: 'creationDate'
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header icon={<Box />} title={'Organizations'}>
        <Button theme="CTA" onClick={showCreateOrganization}>
          Create organization
        </Button>
      </Header>
      <Wrapper>
        <Page>
          <Search
            placeholder="Search organizations..."
            onSearch={search => {
              setFilter((prev: any) => ({
                ...prev,
                search
              }));
              fetchOrganizations({ ...filter, search });
            }}
          />
        </Page>
        <Page>
          <Table
            notFound={<NotFound title="No organizations found" description="Your search did not match any organization" />}
            loading={organizationsProps.loading}
            columns={[
              <Sorter
                key="Sorter"
                onSort={() => {
                  const order = filter.order === 'DESC' ? 'ASC' : 'DESC';
                  setFilter((prev: any) => ({
                    ...prev,
                    order,
                    orderBy: 'name'
                  }));
                  fetchOrganizations({ ...filter, order, orderBy: 'name' });
                }}
                order={filter.orderBy === 'name' ? filter.order : 'NONE'}
              >
                <span>Name</span>
              </Sorter>,
              'Domain',
              'State',
              <Sorter
                key="Sorter"
                onSort={() => {
                  const order = filter.order === 'DESC' ? 'ASC' : 'DESC';
                  setFilter((prev: any) => ({
                    ...prev,
                    order,
                    orderBy: 'creationDate'
                  }));
                  fetchOrganizations({ ...filter, order, orderBy: 'creationDate' });
                }}
                order={filter.orderBy === 'creationDate' ? filter.order : 'NONE'}
              >
                <span>Date created</span>
              </Sorter>,
              <Row align="RIGHT" key={'column_actions'}>
                Actions
              </Row>
            ]}
            data={organizations.map(organization => [
              <span key={organization?.id + 'name'} style={{ opacity: organization?.active ? 1 : 0.6 }}>
                {organization?.name}
              </span>,
              <span key={organization?.id + 'domain'} style={{ opacity: organization?.active ? 1 : 0.6 }}>
                {organization?.domain}
              </span>,
              <div key={organization?.id + 'state'}>
                <Badge
                  className={organization?.active ? 'ds-badge-success' : ''}
                  key={organization?.id + organization?.active}
                  bg={organization?.active ? '' : 'danger'}
                >
                  {organization?.active ? 'Active' : 'Deleted'}
                </Badge>
              </div>,
              dayjs(organization?.createdAt).format('DD/MM/YYYY'),
              <Row align="RIGHT" key={organization?.id + 'actions'}>
                {organization?.active ? (
                  <>
                    <IconButton onClick={() => showEditOrganization(organization?.id)}>
                      <Edit color="#252f4a" size={18} />
                    </IconButton>
                    <IconButton onClick={() => showDeleteOrganization(organization?.id)}>
                      <Trash color="#252f4a" size={18} />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => showRestoreOrganization(organization?.id)}>
                    <RefreshCcw color="#252f4a" size={18} />
                  </IconButton>
                )}
              </Row>
            ])}
          />
        </Page>
        <Row align="SPACE">
          <Row align="LEFT">
            <IconButton key={'download_organizations'} type="button" onClick={() => showDownloadOrganizations()}>
              <Download color="#252f4a" size={16} />
            </IconButton>
            <span>
              Showing {(page.current >= 2 ? 20 : organizations.length) * (page.current - 1) + organizations.length} of {page.records}{' '}
              organizations
            </span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              limit={ORGANIZATIONS_LIMIT_PER_PAGE}
              currentPage={page.current}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchOrganizations(filter, page.current - 1 - 1);
              }}
              nextPage={() => {
                fetchOrganizations(filter, page.current - 1 + 1);
              }}
              skip={skip => fetchOrganizations(filter, skip - 1)}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
