export class Organization {
  id: string;
  name: string;
  domain: string;
  apiKey?: string;
  country?: string;
  language?: string;
  visible: boolean;
  active: boolean;
  climate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
