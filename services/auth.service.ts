import Store from "store";
import { Credentials } from "@/dtos/credentials.dto";
import { api, parseUrl } from "./api";
import { Access } from "@/dtos/access.dto";
import { STORAGE_KEYS } from "@/constants/store.constant";
import { InviteUser as InviteUserDto } from "@/dtos/users/InviteUser.dto";

const PREFIX = "/auth";

export const SignInWithEmailAndPassword = async (
  credentials: Credentials
): Promise<"AUTHORIZED" | "2FA"> => {
  const response = await api.post(
    parseUrl(PREFIX, "/sign-in/credentials"),
    credentials
  );
  const access: Access = response.data;
  if (access.status === "AUTHORIZED") {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return access.status;
};

export const signInWithTFAToken = async (
  TFAToken: string
): Promise<"AUTHORIZED"> => {
  const response = await api.post(
    parseUrl(PREFIX, "/2fa/sign-in/credentials"),
    {},
    {
      headers: {
        Authorization: `TFA ${TFAToken}`,
      },
    }
  );
  const access: Access = response.data;
  if (access.status === "AUTHORIZED") {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return "AUTHORIZED";
};

export const SendRestorePasswordEmail = async (
  email: string
): Promise<void> => {
  await api.post(parseUrl(PREFIX, "/restore"), { email });
};

export const RestorePassword = async (
  token: string,
  password: string
): Promise<void> => {
  await api.post(
    parseUrl(PREFIX, "/restore/password"),
    { password },
    {
      headers: {
        Authorization: `RST ${token}`,
      },
    }
  );
};

export const GetSessionData = async () => {
  return await api.get(parseUrl(PREFIX, "/session"));
};

export const InviteUser = async (invite: InviteUserDto) => {
  return await api.post(parseUrl(PREFIX, "/invite"), invite);
};
