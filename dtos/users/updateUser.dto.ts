import { ROLES } from '@/constants/roles.constants';

export class UpdateUser {
  name?: string;
  surname?: string;
  organizationId?: string;
  role?: ROLES;
  TFA?: boolean;
  active?: boolean;
  visible?: boolean;
}
