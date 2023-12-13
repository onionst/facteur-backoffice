import { TFAEmailSentModal } from "@/modals/TFAEmailSent.modal";
import { createContext, useContext, useState } from "react";

export const ModalContext = createContext<{
  showTFAEmailSent: () => void;
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);

  const context = {
    showTFAEmailSent: () => setEmailSentActive(true),
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
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
