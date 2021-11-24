import React from 'react';
import { Avatar, List } from 'antd';
import Link from 'next/link';

import { getI18nProps } from '~/utils/i18n.utils';
import UserDetailsLayout from './Layout.component';
import { api } from '@tidb-community/datasource';
import { useRouterPage } from '../../../../utils/pagination.utils';

export const getServerSideProps = async (ctx) => {
  const i18nProps = await getI18nProps(['common'])(ctx);

  const { id } = ctx.params;
  const [user, comments] = await Promise.all([api.blog.users.get(id), api.blog.users.getLikes(id)]);

  return {
    props: {
      ...i18nProps,
      id,
      comments,
      user,
    },
  };
};

const CommentsPage = ({ id, user, comments }) => {
  return (
    <UserDetailsLayout userDetails={user} item="评论" itemKey="comments">
      <CommentsList comments={comments} />
    </UserDetailsLayout>
  );
};

const CommentsList = ({
  comments: {
    content,
    page: { number, totalElements },
  },
}) => {
  const { onPageChange } = useRouterPage();

  return (
    <List
      pagination={{ current: number, total: totalElements, onChange: onPageChange }}
      dataSource={content}
      renderItem={({ post, content, commenter }) => (
        <li>
          <List.Item>
            <Avatar src={commenter.avatarURL} size="small" />
            {commenter.username || commenter.name}
            评论了
            <Link href={`/blog/${post.id}`}>「{post.title}」</Link>：{content}
          </List.Item>
        </li>
      )}
    />
  );
};

export default CommentsPage;