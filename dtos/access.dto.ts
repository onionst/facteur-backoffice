export class Access {
  status: 'AUTHORIZED' | '2FA';
  token: string | null;
  refreshToken: string;
}
