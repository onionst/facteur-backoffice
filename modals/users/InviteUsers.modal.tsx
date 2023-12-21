import { Input } from "@/bases/Input";
import s from "../Modals.module.scss";
import Select from "@/bases/Select";
import ModalHeader from "@/components/ModalHeader/ModalHeader";
import { ROLES } from "@/constants/roles.constants";
import { useAuth } from "@/contexts/auth.context";
import { useOrganizations } from "@/contexts/organizations.context";
import { Organization } from "@/dtos/organizations/organization.dto";
import { Divider, Modal, ModalProps } from "antd";
import { FormEvent, useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import Row from "@/bases/Row/Row";
import Button from "@/bases/Button/Button";

export type InviteUsersModalProps = {};
export const InviteUsersModal = (props: InviteUsersModalProps & ModalProps) => {
  const { listOrganizations } = useOrganizations();
  const { session } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [organizations, setOrganizations] = useState<
    Array<Partial<Organization>>
  >([]);
  const [invitations, setInvitations] = useState<
    Array<{ email: string; role: string }>
  >([]);

  const handleListOrganizations = async () => {
    if (session.role === ROLES.SUPER_ADMIN) {
      setOrganizations(await listOrganizations());
    }
  };

  useEffect(() => {
    handleListOrganizations();
  }, [props.open, session]);

  const handleAddInvitation = (e: FormEvent) => {
    try {
      e?.preventDefault();
      setInvitations((prev) => [
        ...prev,
        { email, role: role || ROLES.FACT_CHECKER },
      ]);
      setEmail("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal {...props} closeIcon={<X />}>
      <ModalHeader
        subTitle="Invite users"
        title="Complete the following data to invite a new user"
      />
      <form className={s["ds-modal-form"]} onSubmit={handleAddInvitation}>
        {session.role === ROLES.SUPER_ADMIN && (
          <Select
            defaultValue=""
            label="Organization"
            onChange={(organizationId) => {
              console.log(organizationId);
            }}
            options={[
              {
                value: "",
                label: "",
              },
              ...organizations.map((i) => ({
                value: i?.id || "",
                label: i?.name || "",
              })),
            ]}
          />
        )}
        <div className="w-full">
          <label className="form-label" style={{ marginBottom: 2 }}>
            Invitation
          </label>
          <div className={s["ds-modal-form__invite"]}>
            <Input
              required
              type="email"
              value={email}
              onChange={(v) => setEmail(v.target.value)}
              placeholder="username@organization.com"
            />
            <Select
              onChange={setRole}
              required
              options={[
                { value: "", label: "" },
                {
                  value: ROLES.FACT_CHECKER,
                  label: "Fact-checker",
                },
                {
                  value: ROLES.ADMIN,
                  label: "Admin",
                },
              ]}
            />
            <button type="submit">
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div>
          {invitations.map((invitation) => {
            return (
              <Row align="SPACE" key={invitation.email}>
                <span>{invitation.email}</span>

                <div className={s["ds-modal-form__invite-item"]}>
                  {invitation.role}
                  <div
                    onClick={() =>
                      setInvitations((prev) =>
                        prev.filter(
                          (_invitation) => _invitation.email != invitation.email
                        )
                      )
                    }
                  >
                    <X />
                  </div>
                </div>
              </Row>
            );
          })}
        </div>
        <div className={s["ds-modal-form__buttons"]}>
          <Button
            disabled={invitations?.length === 0}
            type="button"
            theme="CTA"
          >
            Send invitations
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
