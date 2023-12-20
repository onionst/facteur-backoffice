import { CreateOrganizationModal } from "@/modals/CreateOrganization.modal";
import { DeleteOrganizationModal } from "@/modals/DeleteOrganization.modal";
import { EditOrganizationModal } from "@/modals/EditOrganization.modal";
import { RestoreOrganizationModal } from "@/modals/RestoreOrganization.modal";
import { TFAEmailSentModal } from "@/modals/TFAEmailSent.modal";
import { createContext, useContext, useState } from "react";

export const ModalContext = createContext<{
  showTFAEmailSent: () => void;
  showCreateOrganization: () => void;
  showEditOrganization: (id: string) => void;
  showDeleteOrganization: (id: string) => void;
  showRestoreOrganization: (id: string) => void;
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);

  // <--- organizations --->
  const [createOrganizationActive, setCreateOrganizationActive] =
    useState<boolean>(false);
  const [editOrganizationActive, setEditOrganizationActive] =
    useState<string>("");
  const [deleteOrganizationActive, setDeleteOrganizationActive] =
    useState<string>("");
  const [restoreOrganizationActive, setRestoreOrganizationActive] =
    useState<string>("");
  // <--- organizations --->

  const context = {
    showTFAEmailSent: () => setEmailSentActive(true),
    showCreateOrganization: () => setCreateOrganizationActive(true),
    showEditOrganization: (id: string) => setEditOrganizationActive(id),
    showDeleteOrganization: (id: string) => setDeleteOrganizationActive(id),
    showRestoreOrganization: (id: string) => setRestoreOrganizationActive(id),
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
          width={450}
          open={createOrganizationActive}
          onCancel={() => setCreateOrganizationActive(false)}
        />
        <EditOrganizationModal
          footer={null}
          width={450}
          open={editOrganizationActive != ""}
          id={editOrganizationActive}
          onCancel={() => setEditOrganizationActive("")}
        />
        <DeleteOrganizationModal
          footer={null}
          width={450}
          open={deleteOrganizationActive != ""}
          id={deleteOrganizationActive}
          onCancel={() => setDeleteOrganizationActive("")}
        />
        <RestoreOrganizationModal
          footer={null}
          width={450}
          open={restoreOrganizationActive != ""}
          id={restoreOrganizationActive}
          onCancel={() => setRestoreOrganizationActive("")}
        />
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
