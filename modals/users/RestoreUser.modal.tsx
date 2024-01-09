import { Modal, ModalProps } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import ModalHeader from '@/components/ModalHeader/ModalHeader';

import { useUsers } from '@/contexts/users.context';
import { User } from '@/dtos/users/user.dto';
import Card from '@/components/Card/Card';

export type RestoreUserModalProps = {
  id: string;
};
export const RESTORE_USER_CONFIRMATION = 'confirm';
export const RestoreUserModal = (props: RestoreUserModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string>('');
  const { fetchUserData, updateUser } = useUsers();
  const [user, setUser] = useState<Partial<User>>({});

  const handleRestoreUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      if (confirmation?.toLowerCase() != RESTORE_USER_CONFIRMATION) {
        setLoading(false);
        return;
      }
      await updateUser(props.id, {
        name: user.name,
        surname: user.surname,
        email: user.email,
        TFA: user.TFA,
        active: true,
        role: user.role
      });
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
      setConfirmation('');
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
        subTitle="Restore user"
        title={
          user?.email ? `Are you sure you want to restore ${user?.name} ${user?.surname}?` : 'Are you sure you want to restore this user?'
        }
      />
      <form className={s['ds-modal-form']} onSubmit={handleRestoreUser}>
        <Card>
          <Input
            required
            label={`Write '${RESTORE_USER_CONFIRMATION}' to restore this user`}
            placeholder="Restore confirmation"
            value={confirmation}
            onChange={v => setConfirmation(v.target.value)}
          />
        </Card>

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} disabled={confirmation?.toLowerCase() != RESTORE_USER_CONFIRMATION} theme="ATTENTION">
            Restore
          </Button>
          <Button type="button" onClick={props.onCancel} theme="SECONDARY">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
