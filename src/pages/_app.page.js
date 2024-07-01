import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';
import '@pingcap-inc/tidb-community-ui/dist/antd.css';
import 'dayjs/locale/zh';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR, { SWRConfig } from 'swr';
import { api, useApiErrorListener } from '@tidb-community/datasource';
import { appWithTranslation } from 'next-i18next';
import { constants, createAppGlobalStyle, utils } from '@tidb-community/ui';
import { logPageView } from '@tidb-community/tracking-script';
import { message } from 'antd';
import { withLayout } from '@tidb-community/common';

import '~/components/Button/Button.scss';
import '~/components/Container/Container.scss';
import '~/styles/globals.css';
import ErrorPage from './_error.page';
import nextI18NextConfig from '@/next-i18next.config';
import { authContext, AuthContext, MeContext } from '~/context';
import { isEmptyOrNil } from '~/utils/common.utils';

import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import {
  SiteComponentsContext,
  defineSiteComponentsConfig,
  Site,
  Env,
} from '@pingcap-inc/tidb-community-site-components';
import '@pingcap-inc/tidb-community-site-components/dist/index.css';
import Link from 'next/link';

import { fetcher as newFetcher } from '~/api';

dayjs.extend(relativeTime);
// TODO: Need to sync with NextJS locale value
dayjs.locale('zh');

const GlobalStyle = createAppGlobalStyle();

const fetcher = (path, params) => {
  // SWR shallowly compares the arguments on every render, and triggers revalidation
  // if any of them has changed. Thus, if you'd like to pass an object as params to
  // the API call, you may use JSON.stringify to the object params to a string value.
  // Read more: https://swr.vercel.app/docs/arguments#passing-objects
  try {
    params = JSON.parse(params);
  } catch (err) {}
  return R.path(path.split('.'), api)(params);
};

// some attributes would be passed through Link component like `className`
const WrapLink = ({ url, children, ...attrs }) => {
  return (
    <Link href={url}>
      <a href={url} {...attrs}>
        {children}
      </a>
    </Link>
  );
};

// define global configs for @pingcap-inc/tidb-community-site-components
defineSiteComponentsConfig({
  site: Site.home,
  env: Env[process.env.NEXT_PUBLIC_RUNTIME_ENV === 'production' ? 'prod' : process.env.NEXT_PUBLIC_RUNTIME_ENV],
  wrapRouteLink: (key, url, node) => {
    return (
      <WrapLink url={url} key={key}>
        {node}
      </WrapLink>
    );
  },
});

const siteFetchers = {
  fetchers: {
    accounts: newFetcher,
    blog: newFetcher,
    asktug: newFetcher,
  },
};

const App = ({ Component, pageProps, router }) => {
  const [errorStatus, setErrorStatus] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useApiErrorListener((err) => {
    if (!err.status) {
      message.error(utils.errors.getErrorMessage(err));
      return;
    }

    const { status, statusText, data } = err;
    const errorMsg = data?.detail || statusText;

    if ([403, 404].includes(status)) {
      setErrorStatus(status);
      setErrorMsg(errorMsg);
    } else {
      message.error(`${errorMsg}`, 5);
    }
  });

  useEffect(() => {
    const handleRouteChange = () => {
      if (process.env.NEXT_PUBLIC_RUNTIME_ENV === 'production') {
        logPageView();
      }
    };

    document.body.classList.add(constants.appClassName);
    handleRouteChange();

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setErrorStatus();
    setErrorMsg();
  }, [router.pathname]);

  const {
    data: meResp,
    error: meError,
    isValidating: isMeValidating,
    mutate: mutateMe,
  } = useSWR('me', fetcher, {
    // Default configs could be found from
    // https://github.com/vercel/swr/blob/master/src/config.ts
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const meData = meResp?.data;

  authContext.isAnonymous = !!meError;
  authContext.isLoggedIn = !isEmptyOrNil(meData);

  if (errorStatus) {
    return <ErrorPage statusCode={errorStatus} errorMsg={errorMsg} />;
  }

  const WrappedComponent = withLayout(Component);

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <GlobalStyle />
      <AuthContext.Provider value={authContext}>
        <MeContext.Provider value={{ meData, mutateMe, isMeValidating }}>
          <SiteComponentsContext.Provider value={siteFetchers}>
            <WrappedComponent {...pageProps} />
          </SiteComponentsContext.Provider>
        </MeContext.Provider>
      </AuthContext.Provider>
    </SWRConfig>
  );
};

export default appWithTranslation(App, nextI18NextConfig);
