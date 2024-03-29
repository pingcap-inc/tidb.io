import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createFactory } from '@pingcap-inc/tidb-community-editor';
import { api } from '@tidb-community/datasource';
import { useRouter } from 'next/router';
import { message, Modal } from 'antd';
import Axios from 'axios';

const EditContext = createContext({
  title: '',
  origin: undefined,
  category: undefined,
  tags: [],
  content: [],
  setTitle: () => {},
  setOrigin: () => {},
  setCategory: () => {},
  setTags: () => {},
  setContent: () => {},
});

EditContext.displayName = 'EditContext';

export function useEditContext() {
  return useContext(EditContext);
}

export function useEditContextProvider() {
  const factory = useMemo(() => createFactory(), []);
  const [title, setTitle] = useState('');
  const [coverImageURL, setCoverImageURL] = useState(undefined);
  const [origin, setOrigin] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState([{ type: 'paragraph', children: [{ text: '' }] }]);
  const [blogInfo, setBlogInfo] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const uploadCoverImage = useCallback(async (file) => {
    const { downloadURL, uploadURL } = await api.blog.common.upload(file.name, file.type);
    await Axios.put(uploadURL, file, {
      headers: {
        'content-type': file.type,
        'x-oss-object-acl': 'public-read',
      },
    });
    setCoverImageURL(downloadURL);
  }, []);

  const reload = useCallback((slug) => {
    if (slug === 'new') {
      setTitle('');
      // setOrigin(false);
      setCategory(undefined);
      setContent([{ type: 'paragraph', children: [{ text: '' }] }]);
      setTags([]);
      setBlogInfo(undefined);
      setCoverImageURL(undefined);
      return Promise.resolve();
    } else {
      setLoading(true);
      return api.blog
        .getPostBySlug({ slug })
        .then((info) => {
          setTitle(info.title);
          setOrigin(info.origin === 'ORIGINAL' ? false : info.sourceURL);
          setTags(info.tags);
          setCategory(info.category);
          setContent(JSON.parse(info.content));
          setBlogInfo(info);
          setCoverImageURL(info.coverImageURL);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return {
    factory,
    reload,
    loading,
    blogInfo,
    title,
    setTitle,
    coverImageURL,
    setCoverImageURL,
    uploadCoverImage,
    origin,
    setOrigin,
    category,
    setCategory,
    tags,
    setTags,
    content,
    setContent,
  };
}

export function useEditMethods() {
  const router = useRouter();
  const editContext = useEditContext();
  const [operating, setOperating] = useState(false);
  const { reload } = editContext;

  const {
    query: { slug },
  } = router;

  const save = useCallback(
    async (showMessage = false, callback = (slug) => router.push(`/blog/${slug}/edit`)) => {
      try {
        const { title, coverImageURL, origin, category, tags, content, blogInfo } = editContext;
        const body = {
          title,
          origin: typeof origin === 'string' ? 'REPOST' : 'ORIGINAL',
          sourceURL: typeof origin === 'string' ? origin : null,
          content: JSON.stringify(content),
          category: category?.id ?? null,
          tags: tags.map((tag) => tag.id),
          coverImageURL: coverImageURL,
        };
        if (slug === 'new') {
          const res = await api.blog.posts.create(body);
          await reload(res.slug);
          // await router.push(`/blog/${res.slug}`);
          await callback?.(res.slug);
          if (showMessage === true) message.success('草稿保存成功!');
          return res;
        } else {
          await fixStatus(blogInfo.id, blogInfo.status);
          await api.blog.posts.post.update(blogInfo.id, body);
          await reload(slug);
          // await router.push(`/blog/${blogInfo.slug}`);
          // await callback?.(blogInfo.slug);
          if (showMessage === true) message.success('草稿保存成功!');
          return blogInfo;
        }
      } catch (e) {
        message.error('保存失败：' + String(e?.message ?? e));
        throw e;
      } finally {
        setOperating(false);
      }
    },
    [slug, router, editContext]
  );

  const saveAndSubmit = useCallback(async () => {
    try {
      const { slug, id } = await save(false);
      // save() make sure status is DRAFT
      try {
        await api.blog.posts.post.submit(id);
      } finally {
        await router.push(`/blog/${slug}`);
      }
    } catch (e) {
      message.error('提交失败：' + String(e?.message ?? e));
      throw e;
    } finally {
      setOperating(false);
    }
  }, [save, reload]);

  const saveAndPublish = useCallback(async () => {
    try {
      const { slug, id } = await save(undefined);
      // save() make sure status is DRAFT
      try {
        await api.blog.posts.post.publish(id);
      } finally {
        await router.push(`/blog/${slug}`);
      }
    } catch (e) {
      message.error('发布失败：' + String(e?.message ?? e));
      throw e;
    } finally {
      setOperating(false);
    }
  }, [save, reload]);

  return {
    save,
    saveAndSubmit,
    saveAndPublish,
    operating,
  };
}

async function fixStatus(id, status) {
  switch (status) {
    case 'PENDING':
      await api.blog.posts.post.cancelSubmit(id);
      break;
    case 'PUBLISHED':
      try {
        await new Promise((resolve, reject) => {
          Modal.confirm({
            title: '确认操作',
            content: '内容更新后需要重新审核才能上线',
            onOk: () => resolve(),
            onCancel: () => reject('canceled'),
          });
        });
        await api.blog.posts.post.cancelPublish(id);
      } catch (e) {
        if (e !== 'canceled') {
          throw e;
        }
      }
      break;
    default:
      break;
  }
}

export default EditContext;
