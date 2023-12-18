import { Credentials } from "@/dtos/credentials.dto";
import {
  GetSessionData,
  RestorePassword,
  SendRestorePasswordEmail,
  SignInWithEmailAndPassword,
} from "@/services/auth.service";
import Store from "store";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useModal } from "./modal.context";
import { notification } from "antd";
import { STORAGE_KEYS } from "@/constants/store.constant";
import { Session } from "@/dtos/session.dto";
import { ROLES } from "@/constants/roles.constants";
import Logo from "@/bases/logo";

export type AuthContextProps = {
  session: Session;
  signInWithEmailAndPassword: (credentials: Credentials) => Promise<void>;
  sendRestorePasswordEmail: (email: string) => Promise<void>;
  restorePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
export type AuthProviderProps = { children: any };

export const AuthContext = createContext<AuthContextProps>(
  // @ts-ignore
  {}
);

export const AuthProvider = (props: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const modal = useModal();

  const [session, setSession] = useState<Session>({
    email: "",
    role: ROLES.VIEWER,
    name: "",
    surname: "",
    organizationId: "",
  });

  useEffect(() => {
    getSessionData();
  }, [router]);

  const getSessionData = async () => {
    try {
      if (Store.get(STORAGE_KEYS.ACCESS_TOKEN)) {
        if (!session?.email) {
          setLoading(true);
        }
        const { data } = await GetSessionData();
        setSession({
          email: data?.email,
          role: data?.role,
          name: data?.name,
          surname: data?.surname,
          organizationId: data?.organizationId,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      await signOut();
      setLoading(false);
    }
  };

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

  const signOut = async () => {
    try {
      await Store.remove(STORAGE_KEYS.ACCESS_TOKEN);
      router.push("/auth/sign-in");
    } catch (err) {
      console.error(err);
      throw new Error("Default");
    }
  };

  const context = {
    session,
    signInWithEmailAndPassword,
    sendRestorePasswordEmail,
    restorePassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {loading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo size="M" />
        </div>
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
