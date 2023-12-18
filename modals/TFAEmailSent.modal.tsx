import Button from "@/bases/Button/Button";
import { Modal, ModalProps } from "antd";
import { Mail, X } from "react-feather";

export type TFAEmailSentModalProps = {};
export const TFAEmailSentModal = (
  props: TFAEmailSentModalProps & ModalProps
) => {
  return (
    <Modal {...props} closeIcon={<X />}>
      <div className="ds-tfa-modal__mail">
        <Mail />
      </div>
      <h2>{"Let's verify your identity"}</h2>
      <p>We just sent you an email with instructions to sign in.</p>
      <div className="ds-tfa-modal__button">
        <Button onClick={props.onCancel} theme="CTA">
          OK
        </Button>
      </div>
    </Modal>
  );
};
