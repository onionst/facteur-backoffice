import { Credentials } from "@/dtos/credentials.dto";
import {
  RestorePassword,
  SendRestorePasswordEmail,
  SignInWithEmailAndPassword,
} from "@/services/auth.service";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { useModal } from "./modal.context";
import { notification } from "antd";

export type AuthContextProps = {
  signInWithEmailAndPassword: (credentials: Credentials) => Promise<void>;
  sendRestorePasswordEmail: (email: string) => Promise<void>;
  restorePassword: (password: string) => Promise<void>;
};
export type AuthProviderProps = { children: any };

export const AuthContext = createContext<AuthContextProps>(
  // @ts-ignore
  {}
);

export const AuthProvider = (props: AuthProviderProps) => {
  const router = useRouter();
  const modal = useModal();

  const signInWithEmailAndPassword = async (credentials: Credentials) => {
    try {
      const status = await SignInWithEmailAndPassword(credentials);
      if (status === "2FA") {
        modal.showTFAEmailSent();
      } else {
        router.push("/app");
      }
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
          description: "Invalid password or email",
        });
      }
      throw new Error("Unauthorized");
    }
  };

  const sendRestorePasswordEmail = async (email: string) => {
    try {
      await SendRestorePasswordEmail(email);
      notification.success({ message: "Please check your email" });
    } catch (err: any) {
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
      throw new Error("Forbidden");
    }
  };

  const restorePassword = async (password: string) => {
    try {
      const token: any = router?.query?.t;
      RestorePassword(token, password);
      notification.success({ message: "Password reset" });
      router.push("/auth/sign-in");
    } catch (err: any) {
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
      throw new Error("Unauthorized");
    }
  };

  const context = {
    signInWithEmailAndPassword,
    sendRestorePasswordEmail,
    restorePassword,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
