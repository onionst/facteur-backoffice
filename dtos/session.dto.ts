import { CountryISO } from '@/constants/country';
import { LanguageISO } from '@/constants/language';
import { ROLES } from '@/constants/roles.constants';

export class Session {
  email: string;
  role: ROLES;
  name: string;
  TFA?: boolean;
  surname: string;
  organizationId: string;
  organization?: {
    name: string;
    domain: string;
    country?: CountryISO;
    language?: LanguageISO;
  };
}
