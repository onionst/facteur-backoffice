import Button from "@/bases/Button/Button";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";

export type EditOrganizationModalProps = {};
export const EditOrganizationModal = (
  props: EditOrganizationModalProps & ModalProps
) => {
  return <Modal {...props} closeIcon={<X />}></Modal>;
};
