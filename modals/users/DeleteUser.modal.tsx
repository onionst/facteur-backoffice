import { Modal, ModalProps } from 'antd';
import { FormEvent, useEffect, useState } from 'react';
import { X } from 'react-feather';
import s from '../Modals.module.scss';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';
import ModalHeader from '@/components/ModalHeader/ModalHeader';
import Wrapper from '@/components/Wrapper/Wrapper';
import { useUsers } from '@/contexts/users.context';
import { User } from '@/dtos/users/user.dto';

export type DeleteUserModalProps = {
  id: string;
};
export const DELETE_USER_CONFIRMATION = 'delete';
export const DeleteUserModal = (props: DeleteUserModalProps & ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<string>('');
  const { fetchUserData, deleteUser } = useUsers();
  const [user, setUser] = useState<Partial<User>>({});

  const handleDeleteUser = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);
      if (confirmation?.toLowerCase() != DELETE_USER_CONFIRMATION) {
        setLoading(false);
        return;
      }
      await deleteUser(props.id);
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
        subTitle="Delete user"
        title={
          user?.email ? `Are you sure you want to delete ${user?.name} ${user?.surname}?` : 'Are you sure you want to delete this user?'
        }
      />
      <form className={s['ds-modal-form']} onSubmit={handleDeleteUser}>
        <Wrapper>
          <Input
            required
            label={`Write '${DELETE_USER_CONFIRMATION}' to delete this user`}
            placeholder="Delete confirmation"
            value={confirmation}
            onChange={v => setConfirmation(v.target.value)}
          />
        </Wrapper>

        <div className={s['ds-modal-form__buttons']}>
          <Button loading={loading} disabled={confirmation?.toLowerCase() != DELETE_USER_CONFIRMATION} theme="ATTENTION">
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
