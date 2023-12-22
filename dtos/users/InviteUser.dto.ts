import { ROLES } from "@/constants/roles.constants";

export class InviteUser {
  role: string;
  email: string;
  organizationId?: string;
}
