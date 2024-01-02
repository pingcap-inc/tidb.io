import { AxiosRequestConfig } from 'axios';

const SITE_COOKIES = {
  accounts: ['uid', 'dev_sid', 'ssid', '_t'],
  asktug: ['uid', 'dev_sid', 'ssid', '_t'],
  blog: ['uid', 'dev_sid', 'ssid', 'JSESSIONID'],
};

export function passThroughCookies(config: AxiosRequestConfig): AxiosRequestConfig {
  const { passThroughCookies, ssrCtx } = config;
  if (!passThroughCookies || !ssrCtx) {
    return config;
  }

  const cookies = ssrCtx.req.cookies;
  const headers = (config.headers = config.headers || {});

  if (headers.cookie) {
    headers.cookie += ';';
  } else {
    headers.cookie = '';
  }

  headers.cookie += SITE_COOKIES[passThroughCookies]
    .map((name) => [name, cookies[name]])
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join(';');

  return config;
}
