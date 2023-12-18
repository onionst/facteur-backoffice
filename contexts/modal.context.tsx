import { CreateOrganizationModal } from "@/modals/CreateOrganization.modal";
import { EditOrganizationModal } from "@/modals/EditOrganization.modal";
import { TFAEmailSentModal } from "@/modals/TFAEmailSent.modal";
import { createContext, useContext, useState } from "react";

export const ModalContext = createContext<{
  showTFAEmailSent: () => void;
  showCreateOrganization: () => void;
  showEditOrganization: () => void;
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);
  const [createOrganizationActive, setCreateOrganizationActive] =
    useState<boolean>(false);
  const [editOrganizationActive, setEditOrganizationActive] =
    useState<boolean>(false);

  const context = {
    showTFAEmailSent: () => setEmailSentActive(true),
    showCreateOrganization: () => setCreateOrganizationActive(true),
    showEditOrganization: () => setEditOrganizationActive(true),
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
          open={editOrganizationActive}
          onCancel={() => setEditOrganizationActive(false)}
        />
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
