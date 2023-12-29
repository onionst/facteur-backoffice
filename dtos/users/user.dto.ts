import { ROLES } from '@/constants/roles.constants';

export class User {
  id: string;
  name: string;
  surname: string;
  email: string;
  organizationId?: string;
  role: ROLES;
  active: boolean;
  TFA?: boolean;
}
