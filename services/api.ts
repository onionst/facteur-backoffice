import { STORAGE_KEYS } from "@/constants/store.constant";
import axios from "axios";
import Store from "store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = Store.get(STORAGE_KEYS.ACCESS_TOKEN, null);

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      config.headers["Authorization"] = "";
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const parseUrl = (prefix: string, path: string) => prefix + path;
