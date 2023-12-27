import s from "../Modals.module.scss";
import { Input } from "@/bases/Input";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";
import Button from "@/bases/Button/Button";
import { FormEvent, useEffect, useState } from "react";
import { useUsers } from "@/contexts/users.context";
import { User } from "@/dtos/users/user.dto";

export type DeleteUserInvitationModalProps = {
  id: string;
};
export const DELETE_USER_INVITATION_CONFIRMATION = "discard";
export const DeleteUserInvitationModal = (
  props: DeleteUserInvitationModalProps & ModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string>("");
  const { fetchUserData } = useUsers();
  const [user, setUser] = useState<Partial<User>>({});

  const handleDeleteUserInvitation = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      if (confirmation?.toLowerCase() != DELETE_USER_INVITATION_CONFIRMATION) {
        setLoading(false);
        return;
      }
      // await deleteOrganization(props.id);
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchData = async (id: string) => {
    const data = await fetchUserData(id);
    if (!data) {
      // @ts-ignore
      props.onCancel();
    } else {
      setConfirmation("");
      setUser(data);
    }
  };

  useEffect(() => {
    if (props.id) {
      fetchData(props.id);
    }
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />}>
      <ModalHeader
        type="ATTENTION"
        subTitle="Discard invitation"
        title={
          user?.email
            ? `Are you sure you want to discard ${user?.email} invitation?`
            : "Are you sure you want to discard this invitation?"
        }
      />
      <form
        className={s["ds-modal-form"]}
        onSubmit={handleDeleteUserInvitation}
      >
        <Wrapper>
          <Input
            required
            label={`Write '${DELETE_USER_INVITATION_CONFIRMATION}' to discard this invitation`}
            placeholder="Discard confirmation"
            value={confirmation}
            onChange={(v) => setConfirmation(v.target.value)}
          />
        </Wrapper>

        <div className={s["ds-modal-form__buttons"]}>
          <Button
            loading={loading}
            disabled={
              confirmation?.toLowerCase() != DELETE_USER_INVITATION_CONFIRMATION
            }
            theme="ATTENTION"
          >
            Discard
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
