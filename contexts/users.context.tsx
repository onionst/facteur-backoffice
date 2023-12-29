import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { InviteUser as InviteUserDto } from '@/dtos/users/InviteUser.dto';
import { User } from '@/dtos/users/user.dto';
import { InviteUser } from '@/services/auth.service';
import { FetchUsers } from '@/services/user.service';

export type UsersPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export type UsersContextProps = {
  users: User[];
  page: UsersPage;
  loading: boolean;
  fetchUserData: (id: string) => Promise<User | undefined>;
  fetchUsers: (filter?: any, pageIndex?: number) => Promise<void>;
  inviteUser: (payload: InviteUserDto[]) => Promise<void>;
  resendInvitation: (id: string) => Promise<void>;
};

export const USERS_LIMIT_PER_PAGE = 20;

export type UsersProviderProps = { children: any };

export const UsersContext = createContext<UsersContextProps>(
  // @ts-ignore
  {}
);

export const UsersProvider = (props: UsersProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<UsersPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0
  });

  const fetchUserData = async (id: string): Promise<User | undefined> => {
    return users.find(user => user.id === id);
  };

  const fetchUsers = async (filter?: any, pageIndex: number = 1) => {
    try {
      setLoading(true);
      const [data] = await Promise.all([
        FetchUsers({
          ...filter,
          page: pageIndex,
          limit: USERS_LIMIT_PER_PAGE
        })
      ]);
      setUsers(data.users);
      setPage({
        ...data.page,
        records: data.records
      });
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
      setLoading(false);
    }
  };

  const resendInvitation = async (id: string) => {
    try {
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'Invitation resent'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const inviteUser = async (invitations: InviteUserDto[]) => {
    try {
      await Promise.all(invitations.map(payload => InviteUser(payload)));
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: invitations?.length === 1 ? 'Invitation sent' : 'Invitations sent'
      });
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
    }
  };

  const context = {
    page,
    loading,
    users,
    fetchUsers,
    inviteUser,
    fetchUserData,
    resendInvitation
  };
  return <UsersContext.Provider value={context}>{props.children}</UsersContext.Provider>;
};

export const useUsers = () => useContext(UsersContext);
