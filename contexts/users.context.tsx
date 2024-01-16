import { notification } from 'antd';
import { createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { InviteUser as InviteUserDto } from '@/dtos/users/InviteUser.dto';
import { UpdateUser as UpdateUserDto } from '@/dtos/users/updateUser.dto';
import { User } from '@/dtos/users/user.dto';
import { DeleteUser, FetchUsers, InviteUser, ResendInvitation, UpdateUser } from '@/services/user.service';

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
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, payload: UpdateUserDto) => Promise<void>;
  downloadUsers: (page: number, users: Array<Partial<User>>) => Promise<Array<Partial<User>>>;
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
      await ResendInvitation(id);
    } catch (err) {
      console.error(err);
    }
  };

  const inviteUser = async (invitations: InviteUserDto[]) => {
    try {
      const responses = await Promise.all(invitations.map(payload => InviteUser(payload)));
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: invitations?.length === 1 ? 'Invitation sent' : 'Invitations sent'
      });

      responses.forEach((response: User) => {
        setPage(prev => ({
          ...prev,
          records: (prev?.records || 0) + 1
        }));
        users.push({ ...response, name: '', surname: '' });
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

  const updateUser = async (id: string, payload: UpdateUserDto) => {
    try {
      await UpdateUser(id, payload);
      setUsers(prev =>
        prev.map(user => {
          if (user.id != id) {
            return user;
          }
          return {
            ...user,
            ...payload
          };
        })
      );
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'User updated'
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
      throw new Error('Unauthorized');
    }
  };

  const downloadUsers = async (page: number = 0, users: Array<Partial<User>> = []): Promise<Array<Partial<User>>> => {
    try {
      const DOWNLOAD_USERS_LIMIT_PER_PAGE = 50;
      let currentPage = page;
      const organizationsToDownload: Array<Partial<User>> = users;

      const filter = { skip: currentPage * DOWNLOAD_USERS_LIMIT_PER_PAGE, limit: DOWNLOAD_USERS_LIMIT_PER_PAGE };
      const response = await FetchUsers(filter);
      if (response.users.length === 0) {
        return organizationsToDownload;
      } else if (response.users.length < DOWNLOAD_USERS_LIMIT_PER_PAGE) {
        return [...organizationsToDownload, ...response.users];
      } else {
        organizationsToDownload.concat(response.users);
        currentPage += 1;
        return downloadUsers(currentPage, organizationsToDownload);
      }
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
      throw new Error('Unauthorized');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await DeleteUser(id);
      setUsers((prev: any) =>
        prev
          .map((user: any) => {
            if (user.id != id) {
              return user;
            }
            if (!user?.name || !user?.surname) {
              setPage(prev => ({
                ...prev,
                records: (prev?.records || 1) - 1
              }));
              return undefined;
            }
            return {
              ...user,
              active: false
            };
          })
          .filter((i: any) => i)
      );
      notification.success({
        ...NOTIFICATIONS_CONFIG.success,
        message: 'User deleted'
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
    resendInvitation,
    updateUser,
    downloadUsers,
    deleteUser
  };
  return <UsersContext.Provider value={context}>{props.children}</UsersContext.Provider>;
};

export const useUsers = () => useContext(UsersContext);
