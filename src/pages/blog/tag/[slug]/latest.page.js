import { getI18nProps } from '../../../../utils/i18n.utils';
import { api } from '@tidb-community/datasource';

export const getServerSideProps = async (ctx) => {
  const i18nProps = await getI18nProps(['common'])(ctx);

  const { slug } = ctx.params;

  const tag = await api.blog.getTagBySlug(slug);

  const [blogs, hotTags] = await Promise.all([api.blog.getLatest({ tagID: tag.id }), api.blog.getHotTags()]);

  return {
    props: {
      ...i18nProps,
      blogs,
      hotTags,
      tag,
      slug,
    },
  };
};

export { default } from './index.page';
