import { CreateOrganizationModal } from "@/modals/organizations/CreateOrganization.modal";
import { DeleteOrganizationModal } from "@/modals/organizations/DeleteOrganization.modal";
import { EditOrganizationModal } from "@/modals/organizations/EditOrganization.modal";
import { RestoreOrganizationModal } from "@/modals/organizations/RestoreOrganization.modal";
import { TFAEmailSentModal } from "@/modals/TFAEmailSent.modal";
import { DeleteUserModal } from "@/modals/users/DeleteUser.modal";
import { DeleteUserInvitationModal } from "@/modals/users/DeleteUserInvitation.modal";
import { EditUserModal } from "@/modals/users/EditUser.modal";
import { InviteUsersModal } from "@/modals/users/InviteUsers.modal";
import { createContext, useContext, useState } from "react";

export const ModalContext = createContext<{
  auth: {
    showTFAEmailSent: () => void;
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
  };
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);

  // <--- organizations --->
  const [createOrganizationActive, setCreateOrganizationActive] =
    useState<string>("");
  const [editOrganizationActive, setEditOrganizationActive] =
    useState<string>("");
  const [deleteOrganizationActive, setDeleteOrganizationActive] =
    useState<string>("");
  const [restoreOrganizationActive, setRestoreOrganizationActive] =
    useState<string>("");
  // <!--- organizations --->

  // <--- users --->
  const [inviteUsersActive, setInviteUsersActive] = useState<string>("");
  const [deleteUserInvitationActive, setDeleteUserInvitationActive] =
    useState<string>("");
  const [deleteUserActive, setDeleteUserActive] = useState<string>("");
  const [editUserActive, setEditUserActive] = useState<string>("");
  // <!--- users --->

  const context = {
    auth: {
      showTFAEmailSent: () => setEmailSentActive(true),
    },
    organizations: {
      showCreateOrganization: () =>
        setCreateOrganizationActive(Date.now().toString()),
      showEditOrganization: (id: string) => setEditOrganizationActive(id),
      showDeleteOrganization: (id: string) => setDeleteOrganizationActive(id),
      showRestoreOrganization: (id: string) => setRestoreOrganizationActive(id),
    },
    users: {
      showInviteUsers: () => setInviteUsersActive(Date.now().toString()),
      showDeleteUserInvitation: (id: string) =>
        setDeleteUserInvitationActive(id),
      showDeleteUser: (id: string) => setDeleteUserActive(id),
      showEditUser: (id: string) => setEditUserActive(id),
    },
  };

  return (
    <ModalContext.Provider value={context}>
      <>
        <TFAEmailSentModal
          footer={null}
          width={350}
          open={emailSentActive}
          onCancel={() => setEmailSentActive(false)}
        />
        <CreateOrganizationModal
          footer={null}
          width={424}
          open={createOrganizationActive != ""}
          id={createOrganizationActive}
          onCancel={() => setCreateOrganizationActive("")}
        />
        <EditOrganizationModal
          footer={null}
          width={424}
          open={editOrganizationActive != ""}
          id={editOrganizationActive}
          onCancel={() => setEditOrganizationActive("")}
        />
        <DeleteOrganizationModal
          footer={null}
          width={424}
          open={deleteOrganizationActive != ""}
          id={deleteOrganizationActive}
          onCancel={() => setDeleteOrganizationActive("")}
        />
        <RestoreOrganizationModal
          footer={null}
          width={424}
          open={restoreOrganizationActive != ""}
          id={restoreOrganizationActive}
          onCancel={() => setRestoreOrganizationActive("")}
        />
        <InviteUsersModal
          footer={null}
          width={424}
          onCancel={() => setInviteUsersActive("")}
          id={inviteUsersActive}
          open={inviteUsersActive != ""}
        />
        <DeleteUserInvitationModal
          footer={null}
          width={424}
          onCancel={() => setDeleteUserInvitationActive("")}
          id={deleteUserInvitationActive}
          open={deleteUserInvitationActive != ""}
        />
        <DeleteUserModal
          footer={null}
          width={424}
          onCancel={() => setDeleteUserActive("")}
          id={deleteUserActive}
          open={deleteUserActive != ""}
        />
        <EditUserModal
          footer={null}
          width={424}
          onCancel={() => setEditUserActive("")}
          id={editUserActive}
          open={editUserActive != ""}
        />
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
