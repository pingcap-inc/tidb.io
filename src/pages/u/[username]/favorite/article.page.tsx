import * as React from 'react';
import { useState } from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { Divider, List, Skeleton, Spin } from 'antd';
import ListItem from '../_components/ListItem';
import {
  getBadgesByUsername,
  getSummaryByUsername,
  getUserProfileByUsername,
  IProfile,
  IProfileSummary,
  IRawBadges,
  IResponse,
  IPostFavorite,
} from '~/api/asktug/profile';
import { ParsedUrlQuery } from 'querystring';
import { getRelativeDatetime } from '~/utils/datetime.utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import { getPageQuery } from '~/utils/pagination.utils';
import FavoriteTypeTab, { EFavoriteType } from '~/pages/u/[username]/favorite/_component/FavoriteTypeTab';
import {
  getPostUrlBySlug,
  getPostFavoritesByUsername,
  getPostsNumberByUsername,
  getPostFavoritesNumberByUsername,
} from '~/api/blog';
import { useCurrentLogonUser } from '~/pages/u/[username]/profile.hook';
import ErrorPage from '~/components/errorPage';
import EmptyStatus from '~/components/EmptyStatus';
import { blogUrl, forumUrl } from '~/pages/u/[username]/constant.data';

interface IProps {
  badges: IRawBadges[];
  profile: IProfile;
  summary: IProfileSummary;
  postsNumber: number | null;
  postFavoritesNumber: number | null;
  posts: IResponse<IPostFavorite>;
}
interface IQuery extends ParsedUrlQuery {
  username: string;
  page?: string;
  size?: string;
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (ctx) => {
  const { username } = ctx.params;
  const pageInfo = getPageQuery(ctx.query);
  const [i18nProps, badges, profile, summary, posts, postsNumber, postFavoritesNumber] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesByUsername({ username }),
    getUserProfileByUsername({ username }),
    getSummaryByUsername({ username }),
    getPostFavoritesByUsername(username, pageInfo.page, pageInfo.size),
    getPostsNumberByUsername({ username }),
    getPostFavoritesNumberByUsername({ username }),
  ]);
  return {
    props: {
      ...i18nProps,
      badges,
      profile,
      summary,
      posts,
      postsNumber,
      postFavoritesNumber,
    },
  };
};

export default function ProfileFavoriteArticlePage(props: IProps) {
  const { badges, profile, summary, posts, postsNumber, postFavoritesNumber } = props;
  const askTugFavoritesNumber = summary?.user_summary?.bookmark_count ?? 0;
  const allFavoritesNumber: number = askTugFavoritesNumber + (postFavoritesNumber ?? 0);
  const router = useRouter();
  const { username } = router.query as { username: string };
  const pageInfo = getPageQuery(router.query);
  const [pageNumber, setPageNumber] = useState(pageInfo.page);
  const [data, setData] = useState(posts.content);
  const [hasMore, setHasMore] = useState(posts.page.number < posts.page.totalPages);
  const [loading, setLoading] = useState(false);
  const loadMoreData = async () => {
    setLoading(true);
    try {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      const newPosts = await getPostFavoritesByUsername(username, nextPage);
      const newData = newPosts.content ?? [];
      setData((data) => [...data, ...newData]);
      setHasMore(newPosts.page.number < newPosts.page.totalPages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  const isCurrentLogonUser = useCurrentLogonUser(username);
  if (isCurrentLogonUser === undefined) {
    return <Spin size="large" />;
  } else if (isCurrentLogonUser === false) {
    return <ErrorPage statusCode={403} errorMsg={'无法查看其他人的收藏内容'} />;
  }
  const isEmpty: boolean = loading === false && data.length === 0;
  return (
    <ProfileLayout
      badges={badges}
      profile={profile}
      nums={{
        like: summary?.user_summary?.likes_received ?? 0,
        answer: summary?.user_summary?.post_count ?? 0,
        post: postsNumber,
      }}
    >
      <CommonStyled.Action>
        <Tab
          selected={EUgcType.favorite}
          nums={{
            answer: summary?.user_summary?.post_count ?? 0,
            question: summary?.user_summary?.topic_count ?? 0,
            post: postsNumber,
            favorite: allFavoritesNumber,
          }}
        />
      </CommonStyled.Action>
      <FavoriteTypeTab
        currentType={EFavoriteType.article}
        username={username}
        nums={{
          article: postFavoritesNumber,
          topic: askTugFavoritesNumber,
        }}
      />
      <CommonStyled.List>
        {/*{favorites.map((value) => (*/}
        {/*  <ListItem*/}
        {/*    key={value.post_id}*/}
        {/*    url={getTopicUrl(value.topic_id, value.post_number)}*/}
        {/*    title={value.title}*/}
        {/*    summary={value.excerpt}*/}
        {/*    metadataEnd={getRelativeDatetime(value.created_at)}*/}
        {/*  />*/}
        {/*))}*/}
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            loading && (
              <div style={{ marginTop: '16px' }}>
                <Skeleton avatar paragraph={{ rows: 1 }} active />
              </div>
            )
          }
          endMessage={data.length !== 0 && <Divider plain>没有更多内容了</Divider>}
        >
          {isEmpty ? (
            <EmptyStatus description={'你还没有收藏过任何内容'}>
              快前往 <a href={forumUrl}>【问答论坛】</a> 和 <a href={blogUrl}>【社区专栏】</a> 发现更多技术干货吧～
            </EmptyStatus>
          ) : (
            <List
              dataSource={data}
              locale={{ emptyText: '暂无数据' }}
              loading={loading}
              renderItem={(value) =>
                value?.post === null || value?.post === undefined ? (
                  <ListItem key={0} url={'#'} title={'该文章已删除'} summary={'抱歉，该文章已删除'} />
                ) : (
                  <ListItem
                    key={value.post.id}
                    url={getPostUrlBySlug(value.post.slug)}
                    title={value.post.title}
                    summary={value.post.summary}
                    metadataEnd={getRelativeDatetime(value.post.publishedAt)}
                  />
                )
              }
            />
          )}
        </InfiniteScroll>
      </CommonStyled.List>
    </ProfileLayout>
  );
}
