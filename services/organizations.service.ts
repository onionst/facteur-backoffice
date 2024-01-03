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
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX), { params: filter });
  return response?.data;
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
