import * as React from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { Divider, List, Select, Skeleton, Space } from 'antd';
import ListItem from '../_components/ListItem';
import { HeartOutlined, MessageOutlined } from '@ant-design/icons';
import {
  getBadgesByUsername,
  getSummaryByUsername,
  getUserProfileByUsername,
  IProfile,
  IProfileSummary,
  IRawBadges,
} from '../api';
import { getRelativeDatetime } from '~/utils/datetime.utils';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import { getPageQuery } from '~/utils/pagination.utils';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPostsByUsername, getPostUrlBySlug, IResponse, IPost, getPostsNumberByUsername } from '../username';

interface IProps {
  badges: IRawBadges[];
  profile: IProfile;
  summary: IProfileSummary;
  posts: IResponse<IPost>;
  username: string;
  postsNumber?: number;
}
interface IQuery extends ParsedUrlQuery {
  username: string;
  page?: string;
  size?: string;
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (ctx) => {
  const { username } = ctx.params;
  const [i18nProps, badges, profile, summary, posts, postsNumber] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesByUsername(username),
    getUserProfileByUsername(username),
    getSummaryByUsername(username),
    getPostsByUsername(username),
    getPostsNumberByUsername(username),
  ]);
  // console.log('!!posts', posts);
  return { props: { ...i18nProps, badges, profile, summary, posts, username, postsNumber } };
};

export default function ProfileAnswerPage(props: IProps) {
  const { badges, profile, summary, posts, username, postsNumber } = props;
  const router = useRouter();
  const pageInfo = getPageQuery(router.query);
  const [pageNumber, setPageNumber] = useState(pageInfo.page);
  const [data, setData] = useState(posts.content ?? []);
  const [hasMore, setHasMore] = useState(posts.page.number < posts.page.totalPages);
  const [loading, setLoading] = useState(false);
  const loadMoreData = async () => {
    setLoading(true);
    try {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      const newPosts = await getPostsByUsername(username, nextPage);
      const newData = newPosts.content ?? [];
      setData((data) => [...data, ...newData]);
      setHasMore(newPosts.page.number < newPosts.page.totalPages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  return (
    <ProfileLayout
      badges={badges}
      profile={profile}
      nums={{
        like: summary.user_summary.likes_received,
        answer: summary.user_summary.post_count,
        post: postsNumber,
      }}
    >
      <CommonStyled.Action>
        <Tab
          selected={EUgcType.post}
          nums={{
            answer: summary.user_summary.post_count,
            question: summary.user_summary.topic_count,
            post: postsNumber,
            // favorite: summary.user_summary.post_count,
          }}
        />
        <Select defaultValue={''}>
          <Select.Option value={''}>文章状态</Select.Option>
          <Select.Option value={'1'}>文章状态</Select.Option>
          <Select.Option value={'2'}>文章状态</Select.Option>
        </Select>
      </CommonStyled.Action>
      <CommonStyled.List>
        {/*{posts.map((value) => (*/}
        {/*  <ListItem*/}
        {/*    key={value.id}*/}
        {/*    url={`/blog/${value.slug}`}*/}
        {/*    title={value.title}*/}
        {/*    summary={value.title}*/}
        {/*    metadataStart={*/}
        {/*      <Space size={24}>*/}
        {/*        <div>*/}
        {/*          <HeartOutlined /> {value.likes}*/}
        {/*        </div>*/}
        {/*        <div>*/}
        {/*          <MessageOutlined /> {value.comments}*/}
        {/*        </div>*/}
        {/*        /!*<div>*!/*/}
        {/*        /!*  <StarOutlined /> xx*!/*/}
        {/*        /!*</div>*!/*/}
        {/*        /!*<div>*!/*/}
        {/*        /!*  <EyeOutlined /> xx*!/*/}
        {/*        /!*</div>*!/*/}
        {/*      </Space>*/}
        {/*    }*/}
        {/*    metadataEnd={getRelativeDatetime(value.publishedAt)}*/}
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
          <List
            dataSource={data}
            locale={{ emptyText: '暂无数据' }}
            loading={loading}
            renderItem={(value) => (
              <ListItem
                key={value.id}
                url={getPostUrlBySlug(value.slug)}
                title={value.title}
                summary={value.summary}
                metadataStart={
                  <Space size={24}>
                    <div>
                      <HeartOutlined /> {value.likes}
                    </div>
                    <div>
                      <MessageOutlined /> {value.comments}
                    </div>
                    {/*<div>*/}
                    {/*  <StarOutlined /> xx*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*  <EyeOutlined /> xx*/}
                    {/*</div>*/}
                  </Space>
                }
                metadataEnd={getRelativeDatetime(value.publishedAt)}
              />
            )}
          />
        </InfiniteScroll>
      </CommonStyled.List>
    </ProfileLayout>
  );
}
