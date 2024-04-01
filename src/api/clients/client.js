import Cookie from 'js-cookie';
import axios from 'axios';
import { createCaptchaInterceptor } from '@tidb-community/common/utils/axios';
import { getCaptchaToken } from '@tidb-community/common/utils/form';

import { dispatchApiError } from './events';
import { applyDebugInterceptor } from './interceptors/debug';
import { passThroughCookies } from '~/api/clients/interceptors/ssr';

const CSRF_MSG = 'CSRF Failed: CSRF token missing or incorrect.';

const isDispatchGlobalApiError = (status) => {
  return ![400, 409, 428].includes(status);
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  withCredentials: true,
  passThroughCookies: 'accounts',
});

axios.interceptors.request.use(passThroughCookies);
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

applyDebugInterceptor(client);

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

    const { isDispatchApiError, isReturnErrorResponse } = config;

    if (typeof window !== 'undefined') {
      // if CSRF error, reload window to refresh CSRF token
      if (data.detail === CSRF_MSG) window.location.reload();
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

if (process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
  const getCaptcha = (config) => getCaptchaToken({ key: process.env.NEXT_PUBLIC_RECAPTCHA_KEY, action: config.path });
  client.interceptors.request.use(createCaptchaInterceptor('re_token_v3', getCaptcha));
}

export default client;
