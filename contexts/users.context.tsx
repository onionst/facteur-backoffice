import { InviteUser as InviteUserDto } from "@/dtos/users/InviteUser.dto";
import { User } from "@/dtos/users/user.dto";
import { InviteUser } from "@/services/auth.service";
import { FetchUsers } from "@/services/user.service";
import { notification } from "antd";
import { createContext, useContext, useState } from "react";

export type UsersPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export type UsersContextProps = {
  users: Array<User>;
  page: UsersPage;
  fetchUsers: (filter?: any, pageIndex?: number) => Promise<void>;
  inviteUser: (payload: Array<InviteUserDto>) => Promise<void>;
};

export const USERS_LIMIT_PER_PAGE = 20;

export type UsersProviderProps = { children: any };

export const UsersContext = createContext<UsersContextProps>(
  // @ts-ignore
  {}
);

export const UsersProvider = (props: UsersProviderProps) => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [page, setPage] = useState<UsersPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0,
  });

  const fetchUsers = async (filter?: any, pageIndex: number = 1) => {
    try {
      const [data] = await Promise.all([
        FetchUsers({
          ...filter,
          page: pageIndex,
          limit: USERS_LIMIT_PER_PAGE,
        }),
      ]);
      setUsers(data.users);
      setPage({
        ...data.page,
        records: data.records,
      });
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === "object") {
        notification.error({
          message: "Error",
          description: err?.response?.data?.message[0],
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please try again later",
        });
      }
    }
  };

  const inviteUser = async (invitations: Array<InviteUserDto>) => {
    try {
      await Promise.all(invitations.map((payload) => InviteUser(payload)));
      notification.success({
        message:
          invitations?.length === 1 ? "Invitation sent" : "Invitations sent",
      });
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === "object") {
        notification.error({
          message: "Error",
          description: err?.response?.data?.message[0],
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please try again later",
        });
      }
    }
  };

  const context = {
    page,
    users,
    fetchUsers,
    inviteUser,
  };
  return (
    <UsersContext.Provider value={context}>
      {props.children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
