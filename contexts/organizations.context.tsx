import { CreateOrganization as CreateOrganizationDto } from "@/dtos/organizations/createOrganization.dto";
import { FilterOrganizations } from "@/dtos/organizations/filterOrganizations.dto";
import { Organization } from "@/dtos/organizations/organization.dto";
import {
  CreateOrganization,
  FetchOrganizations,
  UpdateOrganization,
} from "@/services/organizations.service";
import Store from "store";
import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/store.constant";
import { UpdateOrganization as UpdateOrganizationDto } from "@/dtos/organizations/updateOrganization.dto";

export type OrganizationsProviderProps = { children: any };
export type OrganizationsContextProps = {
  organizations: Array<Organization>;
  fetchOrganizations: (filter: FilterOrganizations) => Promise<void>;
  createOrganization: (organization: CreateOrganizationDto) => Promise<void>;
  fetchOrganizationData: (id: string) => Promise<Organization | undefined>;
  updateOrganization: (
    id: string,
    payload: UpdateOrganizationDto
  ) => Promise<void>;
};
export const OrganizationsContext = createContext<OrganizationsContextProps>(
  // @ts-ignore
  {}
);

export const OrganizationsProvider = (props: OrganizationsProviderProps) => {
  const [organizations, setOrganizations] = useState<Array<Organization>>([]);

  useEffect(() => {
    setOrganizations([]);
    try {
      if (Store.get(STORAGE_KEYS.ACCESS_TOKEN, null)) {
        fetchOrganizations({ skip: 0, limit: 20 });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchOrganizations = async (filter: FilterOrganizations) => {
    try {
      const data = await FetchOrganizations(filter);
      setOrganizations(data);
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

  const fetchOrganizationData = async (
    id: string
  ): Promise<Organization | undefined> => {
    return organizations.find((organization) => organization.id === id);
  };

  const createOrganization = async (organization: CreateOrganizationDto) => {
    try {
      const data = await CreateOrganization(organization);
      setOrganizations((prev) => [...prev, data]);
      notification.success({
        message: "Organization created",
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
      throw new Error("Unauthorized");
    }
  };

  const updateOrganization = async (
    id: string,
    payload: UpdateOrganizationDto
  ) => {
    try {
      await UpdateOrganization(id, payload);
      setOrganizations((prev) =>
        prev.map((organization) => {
          if (organization.id != id) {
            return organization;
          }
          return {
            ...organization,
            ...payload,
          };
        })
      );
      notification.success({
        message: "Organization updated",
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
      throw new Error("Unauthorized");
    }
  };

  const context = {
    organizations,
    createOrganization,
    fetchOrganizations,
    fetchOrganizationData,
    updateOrganization,
  };
  return (
    <OrganizationsContext.Provider value={context}>
      {props.children}
    </OrganizationsContext.Provider>
  );
};

export const useOrganizations = () => useContext(OrganizationsContext);
