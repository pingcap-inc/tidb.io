import { asktugClient } from '../clients';
import { AxiosRequestConfig } from 'axios';
import { GetServerSidePropsContext } from 'next';

const asktugProdDomain = 'https://asktug.com';
const askTugApiDomain = process.env.NEXT_PUBLIC_ASKTUG_PROXY_BASE_URL ?? asktugProdDomain;
export const askTugDomain = process.env.NEXT_PUBLIC_ASKTUG_WEBSITE_BASE_URL ?? asktugProdDomain;
const accountsDomain = process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL ?? '';

export interface IRawBadges {
  id: number;
  name: string;
  description: string;
  grant_count: number;
  image_url: string;
  listable: boolean;
  enabled: boolean;
  has_badge: boolean;
  long_description: string;
}
export interface IBlogAuthor {
  id: number;
  username: string;
  avatarURL: string;
}

//export interface IBlogCategory {
//  id: number;
//  name: string;
//  slug: string;
//}

export interface IPost {
  id: number;
  slug: string;
  status: string;
  author: IBlogAuthor;
  origin: string;
  title: string;
  summary: string;
  publishedAt?: Date;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt?: Date;
  recommended: boolean;
  recommendAt?: Date;
  tags: [];
  likes: number;
  comments: number;
}

export interface IPostFavorite {
  post: IPost;
  user: IBlogAuthor;
}

export interface IPage {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IResponse<T> {
  content: T[];
  page: IPage;
}

function withAccountsCookies(config: AxiosRequestConfig, ssrCtx?: GetServerSidePropsContext) {
  if (!ssrCtx) {
    return config;
  }
  const cookies = ssrCtx.req.cookies;
  const headers = (config.headers = config.headers || {});

  if (headers.cookie) {
    headers.cookie += ';';
  } else {
    headers.cookie = '';
  }

  headers.cookie += ['ssid', 'dev_sid']
    .map((name) => [name, cookies[name]])
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join(';');

  return config;
}

async function getAllBadges(ssrCtx?: GetServerSidePropsContext): Promise<Map<IRawBadges['id'], IRawBadges>> {
  const result: { badges: any[] } = await asktugClient.get(
    `${askTugApiDomain}/badges.json`,
    withAccountsCookies(
      {
        fallbackResponse: { badges: [] },
      },
      ssrCtx
    )
  );
  const badgesMap = new Map<IRawBadges['id'], IRawBadges>();
  result.badges?.forEach((value) => badgesMap.set(value.id, { ...value, has_badge: false }));
  return badgesMap;
}

export async function getBadgesByUsername(
  input: { username: string },
  ssrCtx?: GetServerSidePropsContext
): Promise<IRawBadges[]> {
  const { username } = input;
  const badgesMap = await getAllBadges();
  const result: { badges: any[] } = await asktugClient.get(
    `${askTugApiDomain}/user-badges/${encodeURIComponent(username)}.json`,
    withAccountsCookies(
      {
        fallbackResponse: { badges: [] },
      },
      ssrCtx
    )
  );
  result.badges?.forEach((value) => badgesMap.set(value.id, { ...value, has_badge: true }));
  const badgesArr: IRawBadges[] = [];
  badgesMap.forEach((value) => badgesArr.push(value));
  return badgesArr;
}

export type TUserBadgeItem = {
  id: number; // 115,
  name: string; // "PCTA",
  description: string; // "PCTA （PingCAP Certified TiDB Associate）是 PingCAP 公司认证 TiDB 数据库专员的缩写。PCTA 要求具备安装部署及日常运维分布式关系型数据库的能力。",
  grant_count: number; // 3094,
  allow_title: boolean; // false,
  multiple_grant: boolean; // false,
  icon: string; // "fa-certificate",
  image_url: string; // "https://img2.pingcap.com/forms/6/1/6110a807f783019b46d4a9ec1a522afcd92183fd.png",
  listable: boolean; // true,
  enabled: boolean; // true,
  badge_grouping_id: number; // 30013,
  system: boolean; // false,
  slug: string; // "-",
  manually_grantable: string; // true,
  badge_type_id: number; // 2
};

export type TUserBadges = {
  badges: TUserBadgeItem[];
};

export type TUserDetail = {
  id: number; // 601596,
  username: string; // "ShawnYan",
  name: string; // "",
  avatar_template: string; // "/user_avatar/asktug.com/shawnyan/{size}/702678_2.png",
  last_posted_at: string; // "2022-10-12T13:55:52.000Z",
  last_seen_at: string; // "2022-10-13T07:09:52.000Z",
  created_at: string; // "2021-10-15T11:12:52.000Z",
  can_edit: boolean; // false,
  can_edit_username: boolean; // false,
  can_edit_email: boolean; // false,
  can_edit_name: boolean; // false,
  ignored: boolean; // false,
  muted: boolean; // false,
  can_ignore_user: boolean; // false,
  can_mute_user: boolean; // true,
  can_send_private_messages: boolean; // true,
  can_send_private_message_to_user: boolean; // true,
  trust_level: number; // 3,
  moderator: boolean; // false,
  admin: boolean; // false,
  title: string; // "TiExplorer",
  uploaded_avatar_id: number; // 702678,
  badge_count: number; // 16,
  custom_fields: string; // {},
  pending_count: number; // 0,
  profile_view_count: number; // 457,
  time_read: number; // 294929,
  recent_time_read: number; // 46498,
  primary_group_name: string; // null,
  primary_group_flair_url: string; // null,
  primary_group_flair_bg_color: string; // null,
  primary_group_flair_color: string; // null,
  custom_avatar_upload_id: number; // 702678,
  custom_avatar_template: string; // "/user_avatar/asktug.com/shawnyan/{size}/702678_2.png",
  is_verified: boolean; // true,
  invited_by: number | null; // null,
};

export async function getUserBadgesByUsername(input: { username: string }): Promise<TUserBadges> {
  const { username } = input;
  const result: TUserBadges = await asktugClient.get(
    `${askTugApiDomain}/user-badges/${encodeURIComponent(username)}.json`
  );
  return result;
}

export interface IProfile {
  username: string;
  avatar_url: string;
  bio: string;
  joined_at: string;
  level: number;
  points: number;
  exps: number;
  level_desc: {
    min_exps: number;
    max_exps: number;
    progress: number;
  };
  can_edit: boolean;
}

export interface IUser {
  id: number; // 601596,
  username: string; // "ShawnYan",
  name: string; // "",
  avatar_template: string; // "/user_avatar/asktug.com/shawnyan/{size}/702678_2.png",
  moderator: boolean; // false,
  admin: boolean; // false,
  is_verified: boolean; // true
}

export async function getUserProfileByUsername(
  input: { username: string },
  ssrCtx?: GetServerSidePropsContext
): Promise<IProfile | null> {
  const { username } = input;
  const result: { data: IProfile } = await asktugClient.get(
    `${accountsDomain}/api/users/${encodeURIComponent(username)}`,
    withAccountsCookies({}, ssrCtx)
  );
  return result.data ?? null;
}

export enum EUserActionFilter {
  /*eslint-disable no-unused-vars*/
  LIKE = 1,
  WAS_LIKED = 2,
  BOOKMARK = 3,
  NEW_TOPIC = 4,
  REPLY = 5,
  RESPONSE = 6,
  MENTION = 7,
  QUOTE = 9,
  EDIT = 11,
  NEW_PRIVATE_MESSAGE = 12,
  GOT_PRIVATE_MESSAGE = 13,
  SOLVED = 15,
  ASSIGNED = 16,
  /*eslint-enable no-unused-vars*/
}

export interface IUserAction {
  topic_id: number;
  post_id: number;
  post_number: number;
  title: string;
  username: string;
  created_at: Date;
  excerpt: string;
}

export const getTopicUrl = (topic_id: number, post_number: number) =>
  `${askTugDomain}/t/topic/${topic_id}/${post_number}`;

export async function getAnswersByUsername(
  input: {
    username: string;
    markedSolution?: boolean;
    pageNumber?: number;
    pageSize?: number;
  },
  ssrCtx?: GetServerSidePropsContext
): Promise<IUserAction[]> {
  const { username, markedSolution = false, pageNumber = 1, pageSize = 10 } = input;
  const offset = (pageNumber - 1) * pageSize;
  const url = `${askTugApiDomain}/user_actions.json?offset=${offset}&username=${encodeURIComponent(username)}&filter=${
    markedSolution ? EUserActionFilter.SOLVED : EUserActionFilter.REPLY
  }`;
  try {
    const result: { user_actions: IUserAction[] } = await asktugClient.get(
      url,
      withAccountsCookies(
        {
          isReturnErrorResponse: true,
          fallbackResponse: { user_actions: [] },
        },
        ssrCtx
      )
    );
    return result.user_actions?.slice(0, pageSize - 1) ?? [];
  } catch (response) {
    if (response?.status && response.status === 404) {
      return [];
    } else {
      throw response?.data;
    }
  }
}

export async function getAskTugFavoritesByUsername(
  username: string,
  pageNumber = 1,
  pageSize = 10
): Promise<IUserAction[]> {
  const offset = (pageNumber - 1) * pageSize;
  const url = `${askTugApiDomain}/user_actions.json?offset=${offset}&username=${encodeURIComponent(username)}&filter=${
    EUserActionFilter.BOOKMARK
  }`;
  try {
    const result: { user_actions: IUserAction[] } = await asktugClient.get(url, {
      isReturnErrorResponse: true,
      fallbackResponse: { user_actions: [] },
    });
    return result.user_actions?.slice(0, pageSize - 1) ?? [];
  } catch (response) {
    if (response?.status && response.status === 404) {
      return [];
    } else {
      throw response?.data;
    }
  }
}

export interface IQuestions {
  id: number;
  topic_id: number;
  title: string;
  posts_count: number;
  reply_count: number;
  created_at: Date;
  views: number;
  like_count: number;
}

export enum ESolved {
  all = '',
  solved = 'solved',
  unsolved = 'unsolved',
}

export async function getQuestionsByUsername(
  input: {
    username: string;
    solved?: ESolved;
    page?: number;
    per_page?: number;
  },
  ssrCtx?: GetServerSidePropsContext
): Promise<IQuestions[]> {
  const { username, solved = ESolved.all, page = 1, per_page = 10 } = input;
  let data: IQuestions[];
  if (solved === ESolved.all) {
    const url = `${askTugApiDomain}/topics/created-by/${encodeURIComponent(username)}.json`;
    const params = { solved: 1, page: page - 1, per_page };
    const result: { topic_list?: { topics: IQuestions[] } } = await asktugClient.get(
      url,
      withAccountsCookies(
        {
          params,
          fallbackResponse: { topic_list: [] },
        },
        ssrCtx
      )
    );
    data = result.topic_list?.topics ?? [];
  } else {
    const url = `${askTugApiDomain}/user_actions.json`;
    const offset = (page - 1) * per_page;
    const params: any = { username, offset };
    if (solved === ESolved.solved) {
      params.filter = EUserActionFilter.SOLVED;
    } else if (solved === ESolved.unsolved) {
      params.unsolved = 1;
    }
    try {
      const result: { user_actions: IQuestions[] } = await asktugClient.get(url, {
        params,
        isReturnErrorResponse: true,
        fallbackResponse: { user_actions: [] },
      });
      data = result.user_actions ?? [];
    } catch (response) {
      if (response?.status && response.status === 404) {
        data = [];
      } else {
        throw response?.data;
      }
    }
  }
  return data;
}

export interface IProfileSummary {
  user_summary: {
    likes_given: number;
    likes_received: number;
    topics_entered: number;
    posts_read_count: number;
    days_visited: number;
    topic_count: number;
    post_count: number;
    time_read: number;
    bookmark_count: number;
  };
  badges: IRawBadges[];
  users: IUser[];
}

export async function getSummaryByUsername(
  input: { username: string },
  ssrCtx?: GetServerSidePropsContext
): Promise<IProfileSummary | null> {
  const { username } = input;
  const url = `${askTugApiDomain}/u/${encodeURIComponent(username)}/summary.json`;
  try {
    const result: IProfileSummary = await asktugClient.get(url, {
      isReturnErrorResponse: true,
      ssrCtx,
    });
    return result ?? null;
  } catch (response) {
    if (response?.status && response.status === 404) {
      return null;
    } else {
      throw response?.data;
    }
  }
}

export type userBadge = {
  id: number; // 1622062,
  granted_at: string; // "2022-01-27T17:20:07.000Z",
  count: number; // 1,
  is_verified: boolean; // true,
  badge_id: number; // 116,
  user_id: number; // 601596,
  granted_by_id: number; // -1
};

export type badge = {
  id: number; // 1622062,
  granted_at: string; // "2022-01-27T17:20:07.000Z",
  count: number; // 1,
  is_verified: boolean; // true,
  badge_id: number; // 116,
  user_id: number; // 601596,
  granted_by_id: number; // -1
};

export type TUser = {
  user_badges: userBadge[];
  badges: TUserBadgeItem[];
  user: TUserDetail;
};

export async function getUserByUsername(input: { username: string }): Promise<TUser | null> {
  const { username } = input;
  const url = `${askTugApiDomain}/u/${encodeURIComponent(username)}.json`;
  try {
    const result: TUser = await asktugClient.get(url);
    return result ?? null;
  } catch (response) {
    if (response?.status === 404) {
      return null;
    } else {
      throw response;
    }
  }
}
