import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Download, Edit, Mail, RefreshCcw, Trash, Users as UsersIcon } from 'react-feather';
import Button from '@/bases/Button/Button';
import IconButton from '@/bases/IconButton/IconButton';
import Row from '@/bases/Row/Row';
import Header from '@/components/Header/Header';
import NotFound from '@/components/NotFound/NotFound';
import Page from '@/components/Page/Page';
import Pagination from '@/components/Pagination/Pagination';
import Search from '@/components/Search/Search';
import { Table } from '@/components/Table/Table';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { useOrganizations } from '@/contexts/organizations.context';
import { USERS_LIMIT_PER_PAGE, useUsers } from '@/contexts/users.context';
import { parseRole } from '@/modals/users/InviteUsers.modal';
import { plainShowing } from '@/utils/plainShowing';
import { safeReturn } from '@/utils/safeReturn';

export default function Users() {
  const modals = useModal();
  const [organizations, setOrganizations] = useState<Array<{ value: string; label: string }>>([]);
  const [filter, setFilter] = useState<any>({});
  const { session } = useAuth();
  const { users, fetchUsers, page, resendInvitation, ...usersProps } = useUsers();
  const { listOrganizations } = useOrganizations();
  const { showInviteUsers, showEditUser, showDownloadUsers, showDeleteUserInvitation, showRestoreUser, showDeleteUser } = modals.users;

  const [resentsList, setResentsList] = useState<Record<string, boolean>>({});

  const handleListOrganization = async () => {
    setOrganizations([
      {
        value: '',
        label: 'Filter by organization'
      },
      ...(await listOrganizations()).map(organization => ({
        value: organization?.id || '',
        label: organization?.name || ''
      }))
    ]);
  };

  useEffect(() => {
    if (session.role === ROLES.SUPER_ADMIN) {
      handleListOrganization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    return () => {
      safeReturn(() => fetchUsers({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onSearch={(search, organizationId, role) => {
              if (organizationId || session.role != ROLES.SUPER_ADMIN) {
                setFilter({
                  surname: search,
                  name: search,
                  email: search,
                  organizationId: session.role === ROLES.SUPER_ADMIN ? organizationId : session.organizationId
                });
                const query: any = {
                  surname: search,
                  name: search,
                  email: search,
                  organizationId: session.role === ROLES.SUPER_ADMIN ? organizationId : session.organizationId
                };
                if (role) {
                  query.role = role;
                }
                fetchUsers(query);
              } else {
                setFilter({
                  surname: search,
                  name: search,
                  email: search
                });
                const query: any = {
                  surname: search,
                  name: search,
                  email: search
                };
                if (role) {
                  query.role = role;
                }
                fetchUsers(query);
              }
            }}
            withSelector={session.role === ROLES.SUPER_ADMIN ? organizations : undefined}
            withRoles={session.role === ROLES.SUPER_ADMIN}
          />
        </Page>
        <Page>
          <Table
            notFound={<NotFound title="No users found" description="Your search did not match any user" />}
            loading={usersProps.loading}
            columns={[
              ...(session.role === ROLES.SUPER_ADMIN ? ['Organization', 'Email'] : ['Email']),
              'Name',
              'Surname',
              'Role',
              'State',
              <Row align="RIGHT" key={'column_actions'}>
                Actions
              </Row>
            ]}
            data={users.map(user => [
              ...(session.role === ROLES.SUPER_ADMIN
                ? [ROLES.ADMIN, ROLES.FACT_CHECKER].includes(user.role)
                  ? [organizations.find(i => i.value === user.organizationId)?.label, user?.email]
                  : ['-', user?.email]
                : [user?.email]),
              user?.name || '-',
              user?.surname || '-',
              <div key={user?.id + 'role'}>
                <Badge key={user?.id + 'role'} bg="secondary">
                  {parseRole(user?.role)}
                </Badge>
              </div>,
              <div key={user?.id + 'state'}>
                <Badge
                  className={user?.name ? 'ds-badge-success' : ''}
                  key={user?.id + user?.active}
                  bg={user?.name ? (user?.active ? '' : 'danger') : 'secondary'}
                >
                  {user?.name ? (user?.active ? 'Active' : 'Deleted') : 'Pending'}
                </Badge>
              </div>,
              <Row align="RIGHT" key={user?.id + 'actions'}>
                {user?.name ? (
                  user?.active ? (
                    <>
                      <IconButton
                        onClick={() => {
                          showEditUser(user?.id);
                        }}
                      >
                        <Edit color="#252f4a" size={18} />
                      </IconButton>
                      {session.email != user.email && (
                        <IconButton
                          onClick={() => {
                            showDeleteUser(user?.id);
                          }}
                        >
                          <Trash color="#252f4a" size={18} />
                        </IconButton>
                      )}
                    </>
                  ) : (
                    <IconButton onClick={() => showRestoreUser(user?.id)}>
                      <RefreshCcw color="#252f4a" size={18} />
                    </IconButton>
                  )
                ) : (
                  <>
                    {!resentsList[user?.id] && (
                      <IconButton
                        onClick={() => {
                          setResentsList(prev => ({
                            ...prev,
                            [user.id]: true
                          }));
                          resendInvitation(user?.id);
                        }}
                      >
                        <Mail color="#252f4a" size={18} />
                      </IconButton>
                    )}
                    <IconButton onClick={() => showDeleteUserInvitation(user?.id)}>
                      <Trash color="#252f4a" size={18} />
                    </IconButton>
                  </>
                )}
              </Row>
            ])}
          />
        </Page>
        <Row align="SPACE">
          <Row align="LEFT">
            <IconButton type="button" onClick={showDownloadUsers}>
              <Download color="#252f4a" size={16} />
            </IconButton>
            <span>{plainShowing(page.current, page.current + USERS_LIMIT_PER_PAGE, page.records, USERS_LIMIT_PER_PAGE, 'users')}</span>
          </Row>
          <Row align="RIGHT">
            <Pagination
              maxPage={page.maxPage}
              limit={USERS_LIMIT_PER_PAGE}
              currentPage={page.current + 1}
              totalRecordsCount={page.records}
              prevPage={() => {
                fetchUsers(filter, page.current);
              }}
              nextPage={() => {
                fetchUsers(filter, page.current + 1 + 1);
              }}
              skip={skip => fetchUsers(filter, skip)}
            />
          </Row>
        </Row>
      </Wrapper>
    </>
  );
}
