import { Credentials } from "@/dtos/credentials.dto";
import { api, parseUrl } from "./api";
import { Access } from "@/dtos/access.dto";
import Store from "store";
import { STORAGE_KEYS } from "@/constants/store.constant";

const PREFIX = "/auth";

export const signInWithEmailAndPassword = async (
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

export const sendRestorePasswordEmail = async (
  email: string
): Promise<void> => {
  await api.post(parseUrl(PREFIX, "/restore"), { email });
};

export const restorePassword = async (
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
