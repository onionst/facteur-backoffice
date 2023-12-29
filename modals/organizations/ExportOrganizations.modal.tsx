import s from "../Modals.module.scss";
import Button from "@/bases/Button/Button";
import { Input } from "@/bases/input";
import Select from "@/bases/Select";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import Wrapper from "@/components/Wrapper/Wrapper";
import { CountryISO } from "@/constants/country";
import { LanguageISO } from "@/constants/language";
import { useOrganizations } from "@/contexts/organizations.context";
import { CreateOrganization } from "@/dtos/organizations/createOrganization.dto";
import { Modal, ModalProps } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { X } from "react-feather";

export type ExportOrganizationModalProps = { id: string };
export const ExportOrganizationModal = (
  props: ExportOrganizationModalProps & ModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateOrganization = (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);

      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Modal {...props} closeIcon={<X />} key={props.id}>
      <ModalHeader
        subTitle="Export organizations"
        title="Complete the following data to create a new organization"
      />
      <form className={s["ds-modal-form"]} onSubmit={handleCreateOrganization}>
        <div className={s["ds-modal-form__buttons"]}>
          <Button loading={loading} theme="CTA">
            Create
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
