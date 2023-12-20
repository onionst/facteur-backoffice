import s from "./Modals.module.scss";
import Button from "@/bases/Button/Button";
import { Input } from "@/bases/input";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import Wrapper from "@/components/Wrapper/Wrapper";
import { useOrganizations } from "@/contexts/organizations.context";
import { CreateOrganization } from "@/dtos/organizations/createOrganization.dto";
import { Modal, ModalProps } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { X } from "react-feather";

export type CreateOrganizationModalProps = {};
export const CreateOrganizationModal = (
  props: CreateOrganizationModalProps & ModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<CreateOrganization>({
    name: "",
    domain: "",
    country: "",
    language: "",
  });
  const { createOrganization } = useOrganizations();

  useEffect(() => {
    setForm({
      name: "",
      domain: "",
      country: "",
      language: "",
    });
  }, [props.open]);

  const handleCreateOrganization = (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      const payload: CreateOrganization = {
        name: form.name?.trim(),
        domain: form.domain?.trim(),
      };
      if (form.domain) {
        payload.domain = form.domain;
      }
      if (form.country) {
        payload.country = form.country;
      }
      createOrganization(payload);
      setForm({ name: "", domain: "", country: "", language: "" });
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Modal {...props} closeIcon={<X />}>
      <ModalHeader
        subTitle="Create organization"
        title="Complete the following data to create a new organization"
      />
      <form className={s["ds-modal-form"]} onSubmit={handleCreateOrganization}>
        <Wrapper>
          <Input
            required
            label="Name"
            placeholder="Organization's name"
            pattern="^[^\.]+$"
            title="Name should not include dots"
            value={form.name}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, name: v.target.value }))
            }
          />
          <Input
            required
            label="Web domain"
            placeholder="e.g: efcsn.com"
            pattern=".*\..+"
            title="Web domain should include at least one dot. e.g: efcsn.com"
            value={form.domain}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, domain: v.target.value }))
            }
          />
          <Input
            label="Country"
            placeholder="Organization's country"
            value={form.country}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, country: v.target.value }))
            }
          />
          <Input
            label="Language"
            placeholder="Organization's main language"
            value={form.language}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, language: v.target.value }))
            }
          />
        </Wrapper>
        <div className={s["ds-modal-form__buttons"]}>
          <Button
            disabled={form?.name === "" || form?.domain === ""}
            loading={loading}
            theme="CTA"
          >
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
