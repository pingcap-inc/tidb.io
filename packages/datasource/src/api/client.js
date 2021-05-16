import Cookie from 'js-cookie';
import axios from 'axios';

import { dispatchApiError } from './events';

const shouldHttpStatusDispatchApiError = (status) => {
  return status !== 400 && status !== 409;
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
});

client.interceptors.request.use((config) => {
  const csrftoken = Cookie.get('csrftoken');

  config.headers = {
    ...config.headers,
    // TODO: Once we support i18n, the `Accept-Language` should be retrieved from
    // a locale code provided by the i18n libarry (Maybe from a cookie or localStorage).
    'Accept-Language': 'zh-hans',
  };

  if (csrftoken) {
    config.headers['X-CSRFTOKEN'] = csrftoken;
  }

  return config;
});

client.interceptors.response.use(
  ({ data }) => data,
  (err) => {
    const { config, response } = err;

    // Some errors may not have response, like the timeout error
    if (!response) {
      dispatchApiError(err);
      return Promise.reject(err);
    }

    const { data, status } = response;

    if (typeof window !== 'undefined') {
      let shouldDispatch = false;
      const { shouldDispatchApiError } = config;

      if (shouldDispatchApiError && shouldDispatchApiError({ data, status })) {
        shouldDispatch = true;
      }

      if (!shouldDispatchApiError && shouldHttpStatusDispatchApiError(status)) {
        shouldDispatch = true;
      }

      if (shouldDispatch) {
        dispatchApiError(response);
      }
    }

    return Promise.reject(config.isReturnErrorResponse ? response : data);
  }
);

export default client;
