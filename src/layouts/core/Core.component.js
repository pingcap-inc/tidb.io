import React from 'react';
import { Header, Footer } from '@pingcap/pingcap-ui';
import { useRouter } from 'next/router';

import { headerNavItems } from './core.data';

const Core = ({ children }) => {
  const router = useRouter();

  const title = 'Community';

  const headerProps = {
    title,
    logo: <img alt={title} src="/images/community/logo.svg" />,
    navItems: headerNavItems,
    selectedKeys: ['About'],

    onTitleClick: () => router.push('/community'),

    onNavClick: ({ link }) => {
      if (link.startsWith('http')) {
        return window.open(link, '_blank');
      }
      router.push(link);
    },
  };

  return (
    <>
      <Header {...headerProps} />
      {children}
      <Footer />
    </>
  );
};

export default Core;
