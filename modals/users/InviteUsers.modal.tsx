import { Modal, ModalProps } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { Coffee, Plus, Search, X, Zap } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import Column from '@/bases/Column/Column';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import ItemSelect from '@/components/Form/ItemSelect/ItemSelect';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';
import { useOrganizations } from '@/contexts/organizations.context';
import { useUsers } from '@/contexts/users.context';
import { Organization } from '@/dtos/organizations/organization.dto';

export const parseRole = (role?: string | null): string => {
  if (!role) {
    return '';
  }
  return (
    {
      SUPER_ADMIN: 'Super administrator',
      ADMIN: 'Administrator',
      FACT_CHECKER: 'Fact checker',
      RESEARCHER: 'Researcher'
    }[role] || ''
  );
};

export type InviteUsersModalProps = { id: string };
export const InviteUsersModal = (props: InviteUsersModalProps & ModalProps) => {
  const { listOrganizations } = useOrganizations();
  const { inviteUser } = useUsers();
  const { session } = useAuth();
  const [step, setStep] = useState<number>(0);
  const [type, setType] = useState<ROLES | null>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>();
  const [organizations, setOrganizations] = useState<Array<Partial<Organization>>>([]);
  const [invitations, setInvitations] = useState<Array<{ email: string; role: string }>>([]);

  const handleListOrganizations = async () => {
    if (session.role === ROLES.SUPER_ADMIN) {
      setOrganizations(await listOrganizations());
    }
  };

  useEffect(() => {
    setStep(0);
    setType(null);
    setInvitations([]);
    setSelectedOrganization('');
    handleListOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, session]);

  const handleAddInvitation = (e: FormEvent) => {
    try {
      e?.preventDefault();
      setInvitations(prev => [...prev, { email: email.toLowerCase(), role: role || ROLES.FACT_CHECKER }]);
      setEmail('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    try {
      setLoading(true);
      if (session.role === ROLES.SUPER_ADMIN) {
        if (type === ROLES.FACT_CHECKER) {
          await inviteUser(
            invitations.map(invitation => ({
              email: invitation.email,
              role: invitation.role,
              organizationId: session.role === ROLES.SUPER_ADMIN ? selectedOrganization : session.organizationId
            }))
          );
        } else if (type === ROLES.RESEARCHER) {
          await inviteUser(
            invitations.map(invitation => ({
              email: invitation.email,
              role: ROLES.RESEARCHER
            }))
          );
        } else if (type === ROLES.SUPER_ADMIN) {
          await inviteUser(
            invitations.map(invitation => ({
              email: invitation.email,
              role: ROLES.SUPER_ADMIN,
              organizationId: ''
            }))
          );
        }
      } else {
        await inviteUser(
          invitations.map(invitation => ({
            email: invitation.email,
            role: invitation.role,
            organizationId: session.role === ROLES.SUPER_ADMIN ? selectedOrganization : session.organizationId
          }))
        );
      }
      setInvitations([]);
      setLoading(false);
      // @ts-ignore
      props.onCancel();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoading(false);
    }
  };

  if (session.role === ROLES.SUPER_ADMIN) {
    return (
      <Modal {...props} closeIcon={<X />} key={props.id}>
        {step === 0 && (
          <>
            <ModalHeader subTitle="Who are you inviting?" title="Choose between Fact-checkers, Researchers or Super administrators" />
            <Column align="CENTER">
              <ItemSelect
                onClick={() => {
                  setType(ROLES.FACT_CHECKER);
                  setSelectedOrganization('');
                  setStep(1);
                }}
                label="Fact-checkers"
                icon={<Search size={18} color="#FFF" />}
              />
              <ItemSelect
                onClick={() => {
                  setType(ROLES.RESEARCHER);
                  setSelectedOrganization('');
                  setStep(1);
                }}
                label="Researchers"
                icon={<Coffee size={18} color="#FFF" />}
              />
              <ItemSelect
                onClick={() => {
                  setType(ROLES.SUPER_ADMIN);
                  setSelectedOrganization('');
                  setStep(1);
                }}
                label="Super administrators"
                icon={<Zap size={18} color="#FFF" />}
              />
            </Column>
          </>
        )}
        {step === 1 && (
          <>
            <ModalHeader subTitle="Invite users" title={`Complete the following data to invite a new ${parseRole(type)}`} />
            <form className={s['ds-modal-form']} onSubmit={handleAddInvitation}>
              {type === ROLES.FACT_CHECKER && (
                <Select
                  defaultValue=""
                  label="Organization"
                  onChange={organization => {
                    if (
                      (!organization &&
                        invitations.find(i =>
                          // @ts-ignore
                          [ROLES.ADMIN, ROLES.FACT_CHECKER].includes(i.role)
                        )) ||
                      (organization &&
                        invitations.find(i =>
                          // @ts-ignore
                          [ROLES.SUPER_ADMIN, ROLES.RESEARCHER].includes(i.role)
                        ))
                    ) {
                      setInvitations([]);
                    }
                    setSelectedOrganization(organization);
                  }}
                  options={[
                    {
                      value: '',
                      label: 'Select organization'
                    },
                    ...organizations.map(i => ({
                      value: i?.id || '',
                      label: i?.name || ''
                    }))
                  ]}
                />
              )}
              {type === ROLES.FACT_CHECKER ? (
                selectedOrganization ? (
                  <div className="w-full">
                    <div
                      className={`${s['ds-modal-form__invite']} ${
                        s[`ds-modal-form__invite--${type === ROLES.FACT_CHECKER ? '' : 'small'}`]
                      }`}
                    >
                      <Input
                        label="Invitation"
                        required
                        type="email"
                        value={email}
                        className="w-full"
                        onChange={v => setEmail(v.target.value)}
                        placeholder="username@organization.com"
                      />
                      {type === ROLES.FACT_CHECKER && (
                        <Select
                          label="Role"
                          onChange={setRole}
                          required
                          options={[
                            { value: '', label: '' },
                            {
                              value: ROLES.FACT_CHECKER,
                              label: 'Fact-checker'
                            },
                            {
                              value: ROLES.ADMIN,
                              label: 'Administrator'
                            }
                          ]}
                        />
                      )}
                      <button type="submit" style={{ marginTop: 24 }}>
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                ) : null
              ) : (
                <div className="w-full">
                  <div className={`${s['ds-modal-form__invite']} ${s['ds-modal-form__invite--small']}`}>
                    <Input
                      label="Invitation"
                      required
                      type="email"
                      value={email}
                      className="w-full"
                      onChange={v => setEmail(v.target.value)}
                      placeholder="username@organization.com"
                    />

                    <button type="submit" style={{ marginTop: 24 }}>
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              )}
              <div>
                {invitations.map(invitation => {
                  return (
                    <Row align="SPACE" key={invitation.email}>
                      <span>{invitation.email}</span>

                      <div className={s['ds-modal-form__invite-item']}>
                        {type === ROLES.FACT_CHECKER ? parseRole(invitation.role) : parseRole(type)}
                        <div onClick={() => setInvitations(prev => prev.filter(_invitation => _invitation.email != invitation.email))}>
                          <X />
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </div>
              <div className={s['ds-modal-form__buttons']}>
                <Button loading={loading} onClick={handleSendInvitations} disabled={invitations?.length === 0} type="button" theme="CTA">
                  Send invitations
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setInvitations([]);
                    setType(null);
                  }}
                  theme="SECONDARY"
                >
                  Go back
                </Button>
                <Button type="button" onClick={props.onCancel} theme="SECONDARY">
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    );
  }

  return (
    <Modal {...props} closeIcon={<X />} key={props.id}>
      <ModalHeader subTitle="Invite users" title="Complete the following data to invite a new user" />
      <form className={s['ds-modal-form']} onSubmit={handleAddInvitation}>
        <div className="w-full">
          <div className={s['ds-modal-form__invite']}>
            <Input
              label="Invitation"
              required
              type="email"
              value={email}
              onChange={v => setEmail(v.target.value)}
              placeholder="username@organization.com"
            />
            <Select
              label="Role"
              onChange={setRole}
              required
              options={[
                { value: '', label: '' },
                {
                  value: ROLES.FACT_CHECKER,
                  label: 'Fact-checker'
                },
                {
                  value: ROLES.ADMIN,
                  label: 'Administrator'
                }
              ]}
            />
            <button type="submit" style={{ marginTop: 24 }}>
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div>
          {invitations.map(invitation => {
            return (
              <Row align="SPACE" key={invitation.email}>
                <span>{invitation.email}</span>

                <div className={s['ds-modal-form__invite-item']}>
                  {parseRole(invitation.role)}
                  <div onClick={() => setInvitations(prev => prev.filter(_invitation => _invitation.email != invitation.email))}>
                    <X />
                  </div>
                </div>
              </Row>
            );
          })}
        </div>
        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} onClick={handleSendInvitations} disabled={invitations?.length === 0} type="button" theme="CTA">
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
