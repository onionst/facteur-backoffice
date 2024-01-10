import { ROLES } from '@/constants/roles.constants';

export class Session {
  email: string;
  role: ROLES;
  name: string;
  surname: string;
  organizationId: string;
  refreshToken: string | undefined;
  idToken: string | undefined;
}
