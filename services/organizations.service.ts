import { api, parseUrl } from './api';
import { CreateOrganization as CreateOrganizationDto } from '@/dtos/organizations/createOrganization.dto';
import { FilterOrganizations } from '@/dtos/organizations/filterOrganizations.dto';
import { Organization } from '@/dtos/organizations/organization.dto';
import { UpdateOrganization as UpdateOrganizationDto } from '@/dtos/organizations/updateOrganization.dto';

const PREFIX = '/organizations';

export const FetchOrganizations = async (
  filter: FilterOrganizations
): Promise<{
  organizations: Organization[];
  records: number;
  page: {
    maxPage: number;
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX), { params: filter });
  const headers = response?.headers;
  const current = parseInt(headers['pagination-page']);
  const maxPage = parseInt(headers['pagination-total-pages']);
  return {
    organizations: response?.data,
    records: parseInt(headers['pagination-count']),
    page: {
      maxPage,
      current: current - 1,
      prevPage: maxPage > 1 && current > 1 ? current - 1 : null,
      nextPage: maxPage > 1 && current < maxPage ? current + 1 : null
    }
  };
};

export const ListOrganizations = async (): Promise<Array<Partial<Organization>>> => {
  const response = await api.get(parseUrl(PREFIX, 'list'));
  return response.data;
};

export const CreateOrganization = async (organization: CreateOrganizationDto): Promise<Organization> => {
  const response = await api.post(parseUrl(PREFIX), organization);
  return response?.data;
};

export const UpdateOrganization = async (id: string, payload: UpdateOrganizationDto) => {
  const response = await api.patch(parseUrl(PREFIX, id), payload);
  return response?.data;
};

export const DeleteOrganization = async (id: string) => {
  const response = await api.delete(parseUrl(PREFIX, id));
  return response?.data;
};
