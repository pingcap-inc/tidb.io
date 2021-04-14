import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Header, Footer, data } from '@tidb-community/ui';

const { navItems: headerNavItems } = data.header;
const { navItems: footerNavItems } = data.footer;

const baseUrl = 'https://tidb.io';
const title = 'TiDB Community';
const logo = <img alt={title} src={`${baseUrl}/images/community/logo.svg`} />;
const onNavClick = (link) => window.open(link, '_blank').focus();

const headerProps = {
  logo,
  title,
  onNavClick,
  navItems: headerNavItems,
  onTitleClick: () => onNavClick(baseUrl),
};

const footerProps = {
  logo,
  title,
  onNavClick,
  navItems: footerNavItems,
};

ReactDOM.render(<Header {...headerProps} />, document.getElementById('asktug-header'));

window.addEventListener('load', () => {
  ReactDOM.render(<Footer {...footerProps} />, document.getElementById('asktug-footer'));
});
