import { client } from '../clients';
import { ApiRequestFunction } from '../structures';
import { Gender } from '../../../packages/datasource/src/api/profile';

export type MeData = {
  id: number;
  username: string;
  avatar_url: string;
  org: {
    slug: string;
    role: string;
  };
  org_enroll?: {
    audit_status: number;
    audit_status_display: string;
    audit_reason: string;
  };
  org_invitations?: {
    org_name: string;
    org_slug: string;
    org_company: string;
    inviter_username: string;
    valid: boolean;
  }[];
};

export const me: ApiRequestFunction<void, { data: MeData }> = () =>
  client.get('/api/me', {
    isDispatchApiError: ({ status }) => {
      return status !== 401;
    },
  });

export enum ECompanyVerifiedStatus {
  unVerified,
  pending,
  verified,
}

export enum ECompanyVerifiedBy {
  email,
  file,
}

export type IProfile = {
  username: string;
  avatar_url: string;
  username_last_modified_at?: string;
  bio?: string;
  name?: string;
  date_of_birth?: string;
  address?: string;
  company_name?: string;
  gender?: Gender;
  job_title?: string;
  company_verified_status: ECompanyVerifiedStatus;
};

export async function profile() {
  return await client.get<IProfile>('/api/profile');
}

export function companySendCode(email: string) {
  return client.post('/api/profile/company/send-code', { email });
}

export function companyVerifyByEmail(email: string, email_code: string) {
  const verification_method = ECompanyVerifiedBy.email;
  return client.post('/api/profile/company/verify', { verification_method, email, email_code });
}

export function companyVerifyByFile(incumbency_cert: File) {
  const verification_method = ECompanyVerifiedBy.file;
  const data = new FormData();
  data.append('verification_method', String(verification_method));
  data.append('incumbency_cert', incumbency_cert);
  return client.post('/api/profile/company/verify', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
