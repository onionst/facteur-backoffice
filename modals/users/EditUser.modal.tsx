import { Modal, ModalProps } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import { useUsers } from '@/contexts/users.context';
import { User } from '@/dtos/users/user.dto';
import Card from '@/components/Card/Card';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Row from '@/bases/Row/Row';
import Switch from '@/bases/Switch/Switch';
import { ROLES } from '@/constants/roles.constants';
import { useAuth } from '@/contexts/auth.context';

export type EditUserModalProps = {
  id: string;
};
export const EditUserModal = (props: EditUserModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchUserData } = useUsers();
  const { session } = useAuth();
  const [user, setUser] = useState<Partial<User>>({});

  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.id]);

  return (
    <Modal {...props} closeIcon={<X />} key={user?.id}>
      <ModalHeader subTitle="Edit user" title={user?.name ? `Update ${user?.name}'s information` : 'Update the information of the user'} />
      <form className={s['ds-modal-form']} onSubmit={handleUpdateUser}>
        <Card title="Personal information">
          <Input
            required
            label="Email"
            placeholder="User's email"
            value={user?.email}
            onChange={v => setUser(prev => ({ ...prev, email: v.target.value }))}
          />
          <Input
            required
            label="Name"
            placeholder="User's name"
            value={user?.name}
            onChange={v => setUser(prev => ({ ...prev, name: v.target.value }))}
          />
          <Input
            required
            label="Surname"
            placeholder="User's surname"
            value={user?.surname}
            onChange={v => setUser(prev => ({ ...prev, surname: v.target.value }))}
          />
        </Card>
        <Row align="SPACE">
          <Card title="2FA">
            <Switch checked={user?.TFA} onChange={TFA => setUser(prev => ({ ...prev, TFA }))} left="Unactive" right="Active" />
          </Card>
          {user?.email != session?.email ? (
            <Card title="Role">
              <Switch
                checked={user?.organizationId ? ROLES.ADMIN === user?.role : ROLES.SUPER_ADMIN === user?.role}
                onChange={state =>
                  setUser(prev => ({
                    ...prev,
                    role: user?.organizationId ? (state ? ROLES.ADMIN : ROLES.FACT_CHECKER) : state ? ROLES.SUPER_ADMIN : ROLES.RESEARCHER
                  }))
                }
                left={user?.organizationId ? 'Fact-checker' : 'Researcher'}
                right={user?.organizationId ? 'Administrator' : 'Super administrator'}
              />
            </Card>
          ) : (
            <div className="w-full" />
          )}
        </Row>

        <div className={s['ds-modal-form__buttons']}>
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
