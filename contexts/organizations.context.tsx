import { CreateOrganization as CreateOrganizationDto } from "@/dtos/organizations/createOrganization.dto";
import { FilterOrganizations } from "@/dtos/organizations/filterOrganizations.dto";
import { Organization } from "@/dtos/organizations/organization.dto";
import {
  CreateOrganization,
  DeleteOrganization,
  FetchOrganizations,
  ListOrganizations,
  UpdateOrganization,
} from "@/services/organizations.service";
import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { UpdateOrganization as UpdateOrganizationDto } from "@/dtos/organizations/updateOrganization.dto";

export type OrganizationsProviderProps = { children: any };
export type OrganizationPage = {
  records: number;
  current: number;
  prevPage: number | null;
  nextPage: number | null;
};
export type OrganizationsContextProps = {
  organizations: Array<Organization>;
  page: OrganizationPage;
  listOrganizations: () => Promise<Array<Partial<Organization>>>;
  fetchOrganizations: (
    filter?: FilterOrganizations,
    pageIndex?: number
  ) => Promise<void>;
  createOrganization: (organization: CreateOrganizationDto) => Promise<void>;
  fetchOrganizationData: (id: string) => Promise<Organization | undefined>;
  updateOrganization: (
    id: string,
    payload: UpdateOrganizationDto
  ) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
};
export const OrganizationsContext = createContext<OrganizationsContextProps>(
  // @ts-ignore
  {}
);

export const ORGANIZATIONS_LIMIT_PER_PAGE = 20;

export const OrganizationsProvider = (props: OrganizationsProviderProps) => {
  const [organizations, setOrganizations] = useState<Array<Organization>>([]);
  const [organizationsList, setOrganizationsList] = useState<
    Array<Partial<Organization>>
  >([]);
  const [page, setPage] = useState<OrganizationPage>({
    current: 1,
    prevPage: null,
    nextPage: null,
    records: 0,
  });

  useEffect(() => {
    setOrganizations([]);
  }, []);

  const fetchOrganizations = async (
    filter?: FilterOrganizations,
    pageIndex: number = 0
  ) => {
    try {
      const [data, _] = await Promise.all([
        FetchOrganizations({
          ...filter,
          skip: pageIndex * ORGANIZATIONS_LIMIT_PER_PAGE,
          limit: ORGANIZATIONS_LIMIT_PER_PAGE,
        }),
        listOrganizations(),
      ]);
      setOrganizations(data.organizations);
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

  const fetchOrganizationData = async (
    id: string
  ): Promise<Organization | undefined> => {
    return organizations.find((organization) => organization.id === id);
  };

  const listOrganizations = async (): Promise<Array<Partial<Organization>>> => {
    if (organizationsList.length > 0) {
      return organizationsList;
    }

    const list = await ListOrganizations();
    setOrganizationsList(list);
    return list;
  };

  const createOrganization = async (organization: CreateOrganizationDto) => {
    try {
      const data = await CreateOrganization(organization);
      setOrganizations((prev) => [...prev, data]);
      setOrganizationsList((prev) => [
        ...prev,
        { id: data?.id, name: data?.name, domain: data?.domain },
      ]);
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

  const deleteOrganization = async (id: string) => {
    try {
      await DeleteOrganization(id);
      setOrganizations((prev) =>
        prev.map((organization) => {
          if (organization.id != id) {
            return organization;
          }
          return {
            ...organization,
            active: false,
          };
        })
      );
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
    page,
    createOrganization,
    fetchOrganizations,
    fetchOrganizationData,
    updateOrganization,
    deleteOrganization,
    listOrganizations,
  };
  return (
    <OrganizationsContext.Provider value={context}>
      {props.children}
    </OrganizationsContext.Provider>
  );
};

export const useOrganizations = () => useContext(OrganizationsContext);
