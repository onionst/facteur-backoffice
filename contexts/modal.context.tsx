import { CreateOrganizationModal } from "@/modals/organizations/CreateOrganization.modal";
import { DeleteOrganizationModal } from "@/modals/organizations/DeleteOrganization.modal";
import { EditOrganizationModal } from "@/modals/organizations/EditOrganization.modal";
import { RestoreOrganizationModal } from "@/modals/organizations/RestoreOrganization.modal";
import { TFAEmailSentModal } from "@/modals/TFAEmailSent.modal";
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
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
