import * as React from 'react';
import { useState } from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { List, Skeleton } from 'antd';
import ListItem from '../_components/ListItem';
import {
  getAskTugFavoritesByUsername,
  getBadgesByUsername,
  getTopicUrl,
  getUserProfileByUsername,
  IProfile,
  IRawBadges,
  IUserAction,
} from '../api';
import { ParsedUrlQuery } from 'querystring';
import { getRelativeDatetime } from '~/utils/datetime.utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';
import { getPageQuery } from '~/utils/pagination.utils';
import FavoriteTypeTab, { EFavoriteType } from '~/pages/u/[username]/favorite/_component/FavoriteTypeTab';

interface IProps {
  badges: IRawBadges[];
  profile: IProfile;
  favoriteTopics: IUserAction[];
  username: string;
}
interface IQuery extends ParsedUrlQuery {
  username: string;
  page?: string;
  size?: string;
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (ctx) => {
  const { username } = ctx.params;
  const pageInfo = getPageQuery(ctx.query);
  const [i18nProps, badges, profile, favoriteTopics] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesByUsername(username),
    getUserProfileByUsername(username),
    getAskTugFavoritesByUsername(username, pageInfo.page, pageInfo.size),
  ]);
  return { props: { ...i18nProps, badges, profile, favoriteTopics, username } };
};

export default function ProfileAnswerPage(props: IProps) {
  const { badges, profile, favoriteTopics, username } = props;
  const router = useRouter();
  const pageInfo = getPageQuery(router.query);
  const [page, setPage] = useState(pageInfo.page);
  const [data, setData] = useState(favoriteTopics);
  const loadMoreData = async () => {
    const newData = await getAskTugFavoritesByUsername(username, page, pageInfo.size);
    setData((data) => [...data, ...newData]);
    setPage((page) => page + 1);
  };
  return (
    <ProfileLayout badges={badges} profile={profile}>
      <CommonStyled.Action>
        <Tab selected={EUgcType.favorite} nums={{ answer: 3, question: 4, post: 5, favorite: 6 }} />
      </CommonStyled.Action>
      <FavoriteTypeTab currentType={EFavoriteType.article} username={username} />
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
          hasMore={data.length !== 0}
          loader={
            <div style={{ marginTop: '16px' }}>
              <Skeleton avatar paragraph={{ rows: 1 }} active />
            </div>
          }
        >
          <List
            dataSource={data}
            locale={{ emptyText: '暂无数据' }}
            renderItem={(value) => (
              <ListItem
                key={value.post_id}
                url={getTopicUrl(value.topic_id, value.post_number)}
                title={value.title}
                summary={value.excerpt}
                metadataEnd={getRelativeDatetime(value.created_at)}
              />
            )}
          />
        </InfiniteScroll>
      </CommonStyled.List>
    </ProfileLayout>
  );
}
