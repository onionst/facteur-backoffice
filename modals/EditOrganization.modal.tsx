import { Input } from "@/bases/input";
import s from "./Modals.module.scss";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import Wrapper from "@/components/Wrapper/Wrapper";
import { Modal, ModalProps } from "antd";
import { X } from "react-feather";
import Button from "@/bases/Button/Button";
import { FormEvent, useEffect, useState } from "react";
import { Organization } from "@/dtos/organizations/organization.dto";
import { useOrganizations } from "@/contexts/organizations.context";
import { UpdateOrganization } from "@/dtos/organizations/updateOrganization.dto";

export type EditOrganizationModalProps = {
  id: string;
};
export const EditOrganizationModal = (
  props: EditOrganizationModalProps & ModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchOrganizationData, updateOrganization } = useOrganizations();
  const [organization, setOrganization] = useState<Partial<Organization>>({});

  const handleUpdateOrganization = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      // @ts-ignore
      const form: Organization = organization;
      const payload: UpdateOrganization = {
        name: form.name?.trim(),
        domain: form.domain?.trim(),
      };
      if (form.domain) {
        payload.domain = form.domain;
      }
      if (form.country) {
        payload.country = form.country;
      }
      await updateOrganization(props.id, payload);
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
      setOrganization(data);
    }
  };

  useEffect(() => {
    fetchData(props.id);
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />}>
      <ModalHeader
        subTitle="Edit organization"
        title={
          organization?.name
            ? `Update ${organization?.name}'s data`
            : "Update the data of the organization"
        }
      />
      <form className={s["ds-modal-form"]} onSubmit={handleUpdateOrganization}>
        <Wrapper>
          <Input
            required
            label="Name"
            placeholder="Organization's name"
            pattern="^[^\.]+$"
            title="Name should not include dots"
            value={organization?.name}
            onChange={(v) =>
              setOrganization((prev) => ({ ...prev, name: v.target.value }))
            }
          />
          <Input
            required
            label="Web domain"
            placeholder="e.g: efcsn.com"
            pattern=".*\..+"
            title="Web domain should include at least one dot. e.g: efcsn.com"
            value={organization?.domain}
            onChange={(v) =>
              setOrganization((prev) => ({ ...prev, domain: v.target.value }))
            }
          />
          <Input
            label="Country"
            placeholder="Organization's country"
            value={organization?.country}
            onChange={(v) =>
              setOrganization((prev) => ({ ...prev, country: v.target.value }))
            }
          />
          <Input
            label="Language"
            placeholder="Organization's main language"
            value={organization?.language}
            onChange={(v) =>
              setOrganization((prev) => ({ ...prev, language: v.target.value }))
            }
          />
        </Wrapper>
        <div className={s["ds-modal-form__buttons"]}>
          <Button loading={loading} theme="CTA">
            Update
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
