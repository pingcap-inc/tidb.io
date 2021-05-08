import { ApiRequestFunction } from '../index';

type MeData = {
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
  org_invite?: {
    org_name: string;
    org_company: string;
    inviter_username: string;
    valid: boolean;
  }[];
};

export const me: ApiRequestFunction<void, MeData>;
