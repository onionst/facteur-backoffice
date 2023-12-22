import { InviteUser as InviteUserDto } from "@/dtos/users/InviteUser.dto";
import { InviteUser } from "@/services/auth.service";
import { notification } from "antd";
import { createContext, useContext } from "react";

export type UsersContextProps = {
  inviteUser: (payload: Array<InviteUserDto>) => Promise<void>;
};

export type UsersProviderProps = { children: any };

export const UsersContext = createContext<UsersContextProps>(
  // @ts-ignore
  {}
);

export const UsersProvider = (props: UsersProviderProps) => {
  const inviteUser = async (invitations: Array<InviteUserDto>) => {
    try {
      await Promise.all(invitations.map((payload) => InviteUser(payload)));
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
    inviteUser,
  };
  return (
    <UsersContext.Provider value={context}>
      {props.children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
