import client from '../client';

const BLOG_API_URL_PREFIX = 'blog/api';

export const getLatest = () => client.get(`${BLOG_API_URL_PREFIX}/posts/latest`);

export const getRecommend = () => client.get(`${BLOG_API_URL_PREFIX}/posts/recommend`);

export const getTags = () => client.get(`${BLOG_API_URL_PREFIX}/tags`);
export const getTagById = (id) => client.get(`${BLOG_API_URL_PREFIX}/tags/${id}`);

export const getCategories = () => client.get(`${BLOG_API_URL_PREFIX}/categories`);