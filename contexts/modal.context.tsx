import { createContext, useContext, useEffect, useState } from 'react';
import { CreateOrganizationModal } from '@/modals/organizations/CreateOrganization.modal';
import { DeleteOrganizationModal } from '@/modals/organizations/DeleteOrganization.modal';
import { EditOrganizationModal } from '@/modals/organizations/EditOrganization.modal';
import { RestoreOrganizationModal } from '@/modals/organizations/RestoreOrganization.modal';
import { TFAEmailSentModal } from '@/modals/TFAEmailSent.modal';
import { DeleteUserModal } from '@/modals/users/DeleteUser.modal';
import { DeleteUserInvitationModal } from '@/modals/users/DeleteUserInvitation.modal';
import { EditUserModal } from '@/modals/users/EditUser.modal';
import { InviteUsersModal } from '@/modals/users/InviteUsers.modal';
import { RestoreUserModal } from '@/modals/users/RestoreUser.modal';
import { AccountModal } from '@/modals/Account.modal';
import { useAuth } from './auth.context';

export const ModalContext = createContext<{
  auth: {
    showTFAEmailSent: () => void;
    showAccount: () => void;
  };
  organizations: {
    showCreateOrganization: () => void;
    showEditOrganization: (id: string) => void;
    showDeleteOrganization: (id: string) => void;
    showRestoreOrganization: (id: string) => void;
  };
  users: {
    showInviteUsers: () => void;
    showDeleteUserInvitation: (id: string) => void;
    showDeleteUser: (id: string) => void;
    showEditUser: (id: string) => void;
    showRestoreUser: (id: string) => void;
  };
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const { session } = useAuth();
  // <--- auth --->
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);
  const [accountActive, setAccountActive] = useState<boolean>(false);
  // <--- auth --->

  // <--- organizations --->
  const [createOrganizationActive, setCreateOrganizationActive] = useState<string>('');
  const [editOrganizationActive, setEditOrganizationActive] = useState<string>('');
  const [deleteOrganizationActive, setDeleteOrganizationActive] = useState<string>('');
  const [restoreOrganizationActive, setRestoreOrganizationActive] = useState<string>('');
  // <!--- organizations --->

  // <--- users --->
  const [inviteUsersActive, setInviteUsersActive] = useState<string>('');
  const [deleteUserInvitationActive, setDeleteUserInvitationActive] = useState<string>('');
  const [deleteUserActive, setDeleteUserActive] = useState<string>('');
  const [editUserActive, setEditUserActive] = useState<string>('');
  const [restoreUserActive, setRestoreUserActive] = useState<string>('');
  // <!--- users --->

  useEffect(() => {
    setEmailSentActive(false);
    setAccountActive(false);
    setCreateOrganizationActive('');
    setEditOrganizationActive('');
    setDeleteOrganizationActive('');
    setRestoreOrganizationActive('');
    setInviteUsersActive('');
    setDeleteUserInvitationActive('');
    setDeleteUserActive('');
    setEditUserActive('');
    setRestoreUserActive('');
  }, [session]);

  const context = {
    auth: {
      showTFAEmailSent: () => setEmailSentActive(true),
      showAccount: () => setAccountActive(true)
    },
    organizations: {
      showCreateOrganization: () => setCreateOrganizationActive(Date.now().toString()),
      showEditOrganization: (id: string) => setEditOrganizationActive(id),
      showDeleteOrganization: (id: string) => setDeleteOrganizationActive(id),
      showRestoreOrganization: (id: string) => setRestoreOrganizationActive(id)
    },
    users: {
      showInviteUsers: () => setInviteUsersActive(Date.now().toString()),
      showDeleteUserInvitation: (id: string) => setDeleteUserInvitationActive(id),
      showDeleteUser: (id: string) => setDeleteUserActive(id),
      showEditUser: (id: string) => setEditUserActive(id),
      showRestoreUser: (id: string) => setRestoreUserActive(id)
    }
  };

  return (
    <ModalContext.Provider value={context}>
      <>
        <TFAEmailSentModal footer={null} width={350} open={emailSentActive} onCancel={() => setEmailSentActive(false)} />
        <AccountModal
          drawerStyle={{ padding: 20 }}
          placement="right"
          styles={{ header: { display: 'none' } }}
          footer={null}
          width={400}
          open={accountActive}
          onClose={() => setAccountActive(false)}
        />
        <CreateOrganizationModal
          footer={null}
          width={424}
          open={createOrganizationActive != ''}
          id={createOrganizationActive}
          onCancel={() => setCreateOrganizationActive('')}
        />
        <EditOrganizationModal
          footer={null}
          width={424}
          open={editOrganizationActive != ''}
          id={editOrganizationActive}
          onCancel={() => setEditOrganizationActive('')}
        />
        <DeleteOrganizationModal
          footer={null}
          width={424}
          open={deleteOrganizationActive != ''}
          id={deleteOrganizationActive}
          onCancel={() => setDeleteOrganizationActive('')}
        />
        <RestoreOrganizationModal
          footer={null}
          width={424}
          open={restoreOrganizationActive != ''}
          id={restoreOrganizationActive}
          onCancel={() => setRestoreOrganizationActive('')}
        />
        <InviteUsersModal
          footer={null}
          width={424}
          onCancel={() => setInviteUsersActive('')}
          id={inviteUsersActive}
          open={inviteUsersActive != ''}
        />
        <DeleteUserInvitationModal
          footer={null}
          width={424}
          onCancel={() => setDeleteUserInvitationActive('')}
          id={deleteUserInvitationActive}
          open={deleteUserInvitationActive != ''}
        />
        <DeleteUserModal
          footer={null}
          width={424}
          onCancel={() => setDeleteUserActive('')}
          id={deleteUserActive}
          open={deleteUserActive != ''}
        />
        <EditUserModal footer={null} width={424} onCancel={() => setEditUserActive('')} id={editUserActive} open={editUserActive != ''} />
        <RestoreUserModal
          footer={null}
          width={424}
          open={restoreUserActive != ''}
          id={restoreUserActive}
          onCancel={() => setRestoreUserActive('')}
        />
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
