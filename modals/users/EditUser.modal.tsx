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
import Select from "@/bases/Select";
import { LanguageISO } from "@/constants/language";
import { CountryISO } from "@/constants/country";
import { useUsers } from "@/contexts/users.context";
import { User } from "@/dtos/users/user.dto";

export type EditUserModalProps = {
  id: string;
};
export const EditUserModal = (props: EditUserModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchUserData } = useUsers();
  const [user, setUser] = useState<Partial<User>>({});

  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      // @ts-ignore
      // const form: Organization = organization;
      // const payload: UpdateOrganization = {
      //   name: form.name?.trim(),
      //   domain: form.domain?.trim(),
      // };
      // if (form.domain) {
      //   payload.domain = form.domain;
      // }
      // if (form.country) {
      //   payload.country = form.country;
      // }
      // await updateOrganization(props.id, payload);
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
      setUser(data);
    }
  };

  useEffect(() => {
    fetchData(props.id);
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />} key={user?.id}>
      <ModalHeader
        subTitle="Edit user"
        title={
          user?.name
            ? `Update ${user?.name}'s information`
            : "Update the information of the user"
        }
      />
      <form className={s["ds-modal-form"]} onSubmit={handleUpdateUser}>
        <Wrapper>
          <Input
            required
            label="Name"
            placeholder="User's name"
            value={user?.name}
            onChange={(v) =>
              setUser((prev) => ({ ...prev, name: v.target.value }))
            }
          />
          <Input
            required
            label="Surname"
            placeholder="User's surname"
            value={user?.surname}
            onChange={(v) =>
              setUser((prev) => ({ ...prev, surname: v.target.value }))
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
