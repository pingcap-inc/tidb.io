import React from 'react';

import { getI18nProps } from '~/utils/i18n.utils';
import BlogList from '~/pages/blog/_components/BlogList/BlogList.component';
import UserDetailsLayout from '../Layout.component';
import { Skeleton } from 'antd';
import { usePrincipal } from '../../../blog.hooks';
import { getPageQuery } from '~/utils/pagination.utils';
import { useRouter } from 'next/router';
import { blogUrl } from '~/pages/u/[username]/constant.data';
import EmptyStatus from '~/components/EmptyStatus';
import useSWR from 'swr';
import StatusSelect from '~/pages/blog/user/[id]/posts/StatusSelect.component';

const status = '';

export const getServerSideProps = async (ctx) => {
  const i18nProps = await getI18nProps(['common'])(ctx);
  const { id: userId } = ctx.params;
  return {
    props: {
      ...i18nProps,
      userId,
    },
  };
};

const PostsAllPage = ({ userId }) => {
  const router = useRouter();

  const { page, size } = getPageQuery(router.query);

  const { hasAuthority, id: logonUserId } = usePrincipal();
  const showFilter = logonUserId === Number(userId) || hasAuthority('READ_OTHERS_POST');

  const { data: user } = useSWR(['blog.users.get', JSON.stringify({ userId })]);
  const { data: blogs } = useSWR(['blog.users.getPosts', JSON.stringify({ userId, status, page, size })]);
  const loading = !blogs || !user;
  if (loading) return <Skeleton active />;

  const tabExtendDOM = showFilter && <StatusSelect value={status} />;
  return (
    <UserDetailsLayout userDetails={user} item="专栏" itemKey="posts" tabExtend={tabExtendDOM}>
      {loading ? (
        <Skeleton active />
      ) : blogs.page.totalElements === 0 ? (
        <EmptyStatus description={'你还没有发表过任何文章'} style={{ boxShadow: 'none' }}>
          快前往 <a href={blogUrl}>【社区专栏】</a> 撰写第一篇技术文章吧～
        </EmptyStatus>
      ) : (
        <BlogList blogs={blogs} showStatusBadge={showFilter} />
      )}
    </UserDetailsLayout>
  );
};

export default PostsAllPage;
