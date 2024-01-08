import { UpdateUser as UpdateUserDto } from '@/dtos/users/updateUser.dto';
import { api, customApi, parseUrl } from './api';
import Store from 'store';
import { User } from '@/dtos/users/user.dto';
import { InviteUser as InviteUserDto } from '@/dtos/users/InviteUser.dto';
import { Join as JoinDto } from '@/dtos/users/Join.dto';
import { Access } from '@/dtos/access.dto';
import { STORAGE_KEYS } from '@/constants/store.constant';

const PREFIX = '/users';

export const FetchUsers = async (
  query: any
): Promise<{
  users: User[];
  records: number;
  page: {
    current: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}> => {
  const response = await api.get(parseUrl(PREFIX), { params: query });
  const headers = response?.headers;
  const current = parseInt(headers['pagination-page']);
  const maxPage = parseInt(headers['pagination-total-pages']);
  return {
    users: response?.data,
    records: parseInt(headers['pagination-count']),
    page: {
      current: current - 1,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < maxPage ? current + 1 : null
    }
  };
};

export const UpdateUser = async (id: string, payload: UpdateUserDto): Promise<void> => {
  await api.patch(parseUrl(PREFIX, id), payload);
};
export const DeleteUser = async (id: string) => {
  const response = await api.delete(parseUrl(PREFIX, id));
  return response?.data;
};

export const InviteUser = async (invite: InviteUserDto): Promise<User> => {
  const response = await api.post(parseUrl(PREFIX, 'invite'), invite);
  return response.data;
};

export const Join = async (join: JoinDto, token: string): Promise<Access> => {
  console.log('AUTH!!!', token);

  const response = await customApi.post(parseUrl(PREFIX, '/invite/join'), join, { headers: { Authorization: `Bearer ${token}` } });
  const access: Access = response.data;
  if (access.status === 'AUTHORIZED') {
    Store.set(STORAGE_KEYS.ACCESS_TOKEN, access.token);
  }
  return access;
};
