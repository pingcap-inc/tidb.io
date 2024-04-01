import * as React from 'react';
import { ParsedUrlQuery } from 'querystring';
// import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useEffect, useMemo } from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
// import { getPageQuery } from '~/utils/pagination.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { Divider, List, Select, Skeleton } from 'antd';
import ListItem from '../_components/ListItem';
import {
  getAnswersByUsername,
  getBadgesByUsername,
  getSummaryByUsername,
  getTopicUrl,
  getUserProfileByUsername,
  IProfile,
  IProfileSummary,
  IRawBadges,
  IUserAction,
} from '~/api/asktug/profile';
import { getRelativeDatetime } from '~/utils/datetime.utils';
import { useRouter } from 'next/router';
import { filterSelectWidth } from '../common.styled';
import EmptyStatus from '~/components/EmptyStatus';
import { forumUrl } from '~/pages/u/[username]/constant.data';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '~/api';
import { getPostFavoritesNumberByUsername, getPostsNumberByUsername } from '~/api/blog';
import useSWR from 'swr';
import { ErrorPage } from '~/components';

interface IProps {
  badges: IRawBadges[];
  profile: IProfile;
  summary: IProfileSummary;
  postsNumber: number | null;
  postFavoritesNumber: number | null;
  answers: IUserAction[];
}
interface IQuery extends ParsedUrlQuery {
  username: string;
  solution?: string | string[];
  page?: string;
  size?: string;
}

const pageNumber = 0;
const pageSize = 20;

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (ctx) => {
  const { username, status } = ctx.params;
  const markedSolution: boolean = status?.[0] === 'solution';
  const [i18nProps, badges, profile, summary, answers, postsNumber, postFavoritesNumber] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesByUsername({ username }),
    getUserProfileByUsername({ username }),
    getSummaryByUsername({ username }, ctx),
    getAnswersByUsername({ pageNumber: pageNumber + 1, pageSize, username, markedSolution }),
    getPostsNumberByUsername({ username }),
    getPostFavoritesNumberByUsername({ username }),
  ]);
  return {
    props: {
      ...i18nProps,
      badges,
      profile,
      summary,
      answers,
      postsNumber,
      postFavoritesNumber,
    },
  };
};

export default function ProfileAnswerPage(props: IProps) {
  const {
    badges: badgesFromSSR,
    profile: profileFromSSR,
    summary: summaryFromSSR,
    answers: answersFromSSR,
    postsNumber: postsNumberFromSSR,
    postFavoritesNumber: postFavoritesNumberFromSSR,
  } = props;

  const router = useRouter();
  const { status, username } = router.query;
  const statusPathInfo: string = status?.[0] ?? '';
  const markedSolution: boolean = status?.[0] === 'solution';

  const fallbackData = [answersFromSSR];

  const { data, error, setSize, mutate } = useSWRInfinite<IUserAction[]>(
    (pageNumber) => [
      'asktug.profile.getAnswersByUsername',
      { pageNumber: pageNumber + 1, pageSize, username, markedSolution },
    ],
    {
      fetcher,
      fallbackData,
    }
  );

  useEffect(() => {
    mutate(() => [[]], false).then();
  }, [mutate, markedSolution]);

  // use swr infinite holds all the resp lists
  const answers = useMemo(() => {
    const result: IUserAction[] = [];
    data?.flatMap((value) => result.push(...value));
    return result;
  }, [data]);

  const loadMoreData = useCallback(async () => {
    await setSize((size) => size + 1);
  }, [setSize]);

  const isLoading = !data && !error;

  const hasMore: boolean = useMemo<boolean>(() => {
    // if not loaded, has more
    if (!data) {
      return true;
    }
    return data[data.length - 1].length >= pageSize;
  }, [data]);

  const { data: profileData, error: profileError } = useSWR(['asktug.profile.getUserProfileByUsername', { username }], {
    fallbackData: profileFromSSR,
  });
  if (profileError) console.error('profileError', profileError);

  const { data: badgesData, error: badgesError } = useSWR(['asktug.profile.getBadgesByUsername', { username }], {
    fallbackData: badgesFromSSR,
  });
  if (badgesError) console.error('badgesError', badgesError);

  const { data: postFavoritesNumberData, error: postFavoritesNumberError } = useSWR(
    ['blog.getPostFavoritesNumberByUsername', { username }],
    {
      fallbackData: postFavoritesNumberFromSSR,
    }
  );
  if (postFavoritesNumberError) console.error('postFavoritesNumberError', postFavoritesNumberError);

  const postFavoritesNumber: number | null = postFavoritesNumberError ? null : postFavoritesNumberData;

  const { data: summaryData, error: summaryError } = useSWR(['asktug.profile.getSummaryByUsername', { username }], {
    fallbackData: summaryFromSSR,
  });
  if (summaryError) console.error('summaryError', summaryError);

  const askTugFavoritesNumber: number | null = summaryError ? null : summaryData?.user_summary?.bookmark_count ?? 0;
  const allFavoritesNumber: number | null = summaryError ? null : askTugFavoritesNumber + (postFavoritesNumber ?? 0);
  const likeNumber: number | null = summaryData?.user_summary?.likes_received ?? null;
  const answerNumber: number | null = summaryData?.user_summary?.post_count ?? null;
  const questionNumber: number | null = summaryData?.user_summary?.topic_count ?? null;

  const { data: postsNumberData, error: postsNumberError } = useSWR(['blog.getPostsNumberByUsername', { username }], {
    fallbackData: postsNumberFromSSR,
  });
  if (postsNumberError) console.error('postsNumberError', postsNumberError);

  const postsNumber: number | null = postsNumberData;

  if (profileData === null) {
    return <ErrorPage statusCode={404} errorMsg={`用户 ${username} 不存在`} />;
  }

  const isEmpty: boolean = !isLoading && answers.length === 0;

  return (
    <ProfileLayout
      badges={badgesData}
      profile={profileData}
      nums={{
        like: likeNumber,
        answer: answerNumber,
        post: postsNumber,
      }}
    >
      <CommonStyled.Action>
        <Tab
          selected={EUgcType.answer}
          nums={{
            answer: answerNumber,
            question: questionNumber,
            post: postsNumber,
            favorite: allFavoritesNumber,
          }}
        />
        <Select
          defaultValue={statusPathInfo}
          value={statusPathInfo}
          onChange={(value) =>
            router.push(`/u/${encodeURIComponent(username as string)}/answer/${value}`, undefined, { shallow: true })
          }
          style={{ width: filterSelectWidth }}
        >
          <Select.Option value={''}>全部</Select.Option>
          <Select.Option value={'solution'}>被标记为解决方案</Select.Option>
        </Select>
      </CommonStyled.Action>
      <CommonStyled.List>
        <InfiniteScroll
          dataLength={answers.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            <div style={{ marginTop: '16px' }}>
              <Skeleton avatar paragraph={{ rows: 1 }} active />
            </div>
          }
          endMessage={answers.length !== 0 && <Divider plain>没有更多内容了</Divider>}
        >
          {isEmpty ? (
            <EmptyStatus description={'你还没有回答过任何问题'}>
              快前往 <a href={forumUrl}>【问答论坛】</a> 答疑解惑吧～
            </EmptyStatus>
          ) : (
            <List
              dataSource={answers}
              //loading={loading}
              locale={{ emptyText: '暂无数据' }}
              renderItem={(value) => {
                return (
                  <ListItem
                    key={value.post_id}
                    url={getTopicUrl(value.topic_id, value.post_number)}
                    title={value.title}
                    summary={value.excerpt}
                    metadataEnd={getRelativeDatetime(value.created_at)}
                  />
                );
              }}
            />
          )}
        </InfiniteScroll>
      </CommonStyled.List>
    </ProfileLayout>
  );
}
