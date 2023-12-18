import Button from "@/bases/Button/Button";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";

export type CreateUserModalProps = {};
export const CreateUserModal = (props: CreateUserModalProps & ModalProps) => {
  return <Modal {...props} closeIcon={<X />}></Modal>;
};
