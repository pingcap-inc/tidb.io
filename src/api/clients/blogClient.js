import axios from 'axios';
import { dispatchApiError } from './events';
import { applyDebugInterceptor } from './interceptors/debug';
import { passThroughCookies } from '~/api/clients/interceptors/ssr';

const isDispatchGlobalApiError = (status) => {
  return ![400, 409, 428].includes(status);
};

const blogClient = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL ?? '') + '/blog',
  withCredentials: true,
  headers: {
    accept: 'application/json',
  },
  passThroughCookies: 'blog',
});
// axios.interceptors.request.use((config) => {
//   console.log('request params：', config);
//   return config;
// }, error => {
//   return Promise.reject(error);
// });
axios.interceptors.request.use(passThroughCookies);
applyDebugInterceptor(blogClient);

blogClient.interceptors.response.use(
  ({ data }) => {
    return data;
  },
  (err) => {
    const { config, response } = err;

    // Some errors may not have response, like the timeout error
    if (!response) {
      dispatchApiError(err);
      return Promise.reject(err);
    }

    const { data, status } = response;
    const { isDispatchApiError, isReturnErrorResponse } = config;

    if (typeof window !== 'undefined') {
      let isDispatch = false;

      if (isDispatchApiError?.({ data, status })) {
        isDispatch = true;
      } else if (!isDispatchApiError && isDispatchGlobalApiError(status)) {
        isDispatch = true;
      }

      if (isDispatch) {
        dispatchApiError(response);
      }
    }

    return Promise.reject(isReturnErrorResponse ? response : data);
  }
);

export default blogClient;
