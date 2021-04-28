import * as form from './form';
import { defaultEnvDomains } from './config.domains';
import { getData as getNavData } from './nav';

export * as api from './api';

export const getData = ({ domain, path, locale, env, envDomainConfig } = {}) => {
  const defaultEnv = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_RUNTIME_ENV) || 'production';

  env = env || defaultEnv;
  if (env !== 'production' && env !== 'local') {
    env = 'preview';
  }

  const domainConfig = (envDomainConfig || defaultEnvDomains)[env];

  return {
    nav: getNavData({
      domain,
      path,
      locale,
      env,
      domainConfig,
    }),
  };
};

export const getFormData = () => {
  return form;
};
