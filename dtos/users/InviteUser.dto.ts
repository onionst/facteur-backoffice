import { ROLES } from "@/constants/roles.constants";

export class InviteUser {
  role: ROLES;
  email: string;
  organizationId?: string;
}
