import s from "../Modals.module.scss";
import { Input } from "@/bases/input";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";
import Button from "@/bases/Button/Button";
import { FormEvent, useEffect, useState } from "react";
import { Organization } from "@/dtos/organizations/organization.dto";
import { useOrganizations } from "@/contexts/organizations.context";
import { UpdateOrganization } from "@/dtos/organizations/updateOrganization.dto";

export type DeleteOrganizationModalProps = {
  id: string;
};
export const DeleteOrganizationModal = (
  props: DeleteOrganizationModalProps & ModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchOrganizationData, deleteOrganization } = useOrganizations();
  const [organization, setOrganization] = useState<Partial<Organization>>({});
  const [confirmation, setConfirmation] = useState<string>("");

  const handleDeleteOrganization = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      if (confirmation?.toLowerCase() != organization?.name?.toLowerCase()) {
        setLoading(false);
        return;
      }
      await deleteOrganization(props.id);
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchData = async (id: string) => {
    const data = await fetchOrganizationData(id);
    if (!data) {
      // @ts-ignore
      props.onCancel();
    } else {
      setConfirmation("");
      setOrganization(data);
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
        subTitle="Delete organization"
        title={
          organization?.name
            ? `Are you sure you want to delete ${organization?.name}?`
            : "Are you sure you want to delete this organization?"
        }
      />
      <form className={s["ds-modal-form"]} onSubmit={handleDeleteOrganization}>
        <Wrapper>
          <Input
            required
            label={`Write '${organization?.name}' to delete this organization`}
            placeholder="Delete confirmation"
            value={confirmation}
            onChange={(v) => setConfirmation(v.target.value)}
          />
        </Wrapper>

        <div className={s["ds-modal-form__buttons"]}>
          <Button
            loading={loading}
            disabled={
              confirmation?.toLowerCase() != organization?.name?.toLowerCase()
            }
            theme="ATTENTION"
          >
            Delete
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
