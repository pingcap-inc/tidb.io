import * as React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { api } from '@tidb-community/datasource';

import * as styled from './index.styled';

import { getI18nProps } from '~/utils/i18n.utils';
import { CommunityHead } from '~/components';
import { PageDataContext } from '~/context';
import { link as linkUtils } from '~/utils';

import BlogLayout from './BlogLayout.component';
import CategoryList from './home/CategoryList';
import CategoryListMobile from './home/CategoryListMobile';
import SearchOnMobile from './home/SearchOnMobile';
import OrderBySwitch from './home/OrderBySwitch';
import BlogList from './BlogList';
import HotTagList from './HotTagList';

export const getServerSideProps = async (ctx) => {
  const i18nProps = await getI18nProps(['common', 'page-events'])(ctx);

  const categories = await api.blog.getCategories();
  const blogs = await api.blog.getRecommend();
  const hotTags = await api.blog.getHotTags();

  return {
    props: {
      ...i18nProps,
      categories,
      blogs,
      hotTags,
    },
  };
};

export default function BlogHomepage({ categories, blogs, hotTags }) {
  const router = useRouter();
  const handleClickWrite = (e) => {
    e.preventDefault();
    linkUtils.handleRedirect(router, '/blog');
  };
  return (
    <PageDataContext.Provider value={{}}>
      <CommunityHead
        title="博客"
        // description
        // keyword
      />
      <BlogLayout>
        <styled.Content>
          <styled.Container>
            <styled.Start>
              <CategoryList categories={categories} />
            </styled.Start>
            <styled.Center>
              <CategoryListMobile categories={categories} />
              <SearchOnMobile />
              <OrderBySwitch />
              <BlogList blogs={blogs} />
            </styled.Center>
            <styled.End>
              <styled.WriteBlog>
                <Button icon={<EditOutlined />} onClick={handleClickWrite} type="primary" block>
                  写博客
                </Button>
              </styled.WriteBlog>
              <HotTagList hotTags={hotTags} />
            </styled.End>
          </styled.Container>
        </styled.Content>
      </BlogLayout>
    </PageDataContext.Provider>
  );
}
