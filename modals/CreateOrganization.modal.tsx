import Button from "@/bases/Button/Button";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";

export type CreateOrganizationModalProps = {};
export const CreateOrganizationModal = (
  props: CreateOrganizationModalProps & ModalProps
) => {
  return <Modal {...props} closeIcon={<X />}></Modal>;
};
