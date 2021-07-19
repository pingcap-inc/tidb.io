import * as R from 'ramda';
import React, { useContext } from 'react';
import useSWR from 'swr';
import { InfoCircleFilled } from '@ant-design/icons';
import { Popover } from 'antd';
import { createAppGlobalStyle, constants, Link } from '@tidb-community/ui';

import * as Styled from './contactUs.styled';
import Icon from './icon.svg';
import { AuthContext } from '@/context/auth.context';

const { appClassName } = constants;
const GlobalStyle = createAppGlobalStyle();

const getUrl = (path) => `${process.env.NEXT_PUBLIC_HOME_URL}${path}`;

const ContactUs = () => {
  const { error: meError } = useSWR('me', {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  const { data: resp } = useSWR('contactUs.qualifications');

  const data = resp?.data || {};
  const isAnonymous = !!meError;
  const { login } = useContext(AuthContext);

  const isEnabled = !R.isEmpty(data) && R.pipe(R.values, R.all(R.equals(true)))(data);
  const isDisabled = !isEnabled;

  const NavLink = ({ path, children }) => (
    <Link href={getUrl(path)} onClick={(e) => isDisabled && e.preventDefault()}>
      {children}
    </Link>
  );

  const links = R.intersperse(
    '、',
    [
      data.company_info_is_completed === false && <Link href={getUrl('/my/company')}>完善公司信息</Link>,
      data.phone_email_is_completed === false && <Link href={getUrl('/my/settings')}>绑定手机号和邮箱</Link>,
    ].filter(Boolean)
  );

  let desc;
  if (isAnonymous) {
    desc = (
      <>
        联系社区专家之前，请先
        <span onClick={(e) => login()}>登录</span>
      </>
    );
  } else if (!R.isEmpty(links)) {
    desc = <>联系社区专家之前，请先完{links}，一般更好地处理您的问题</>;
  }

  const content = (
    <Styled.PopoverContainer isDisabled={isDisabled}>
      {desc && (
        <Styled.PopoverDesc>
          <InfoCircleFilled />
          {desc}
        </Styled.PopoverDesc>
      )}

      <ul>
        <li>
          <NavLink path="/contact-us/incident">
            <h3>紧急事故处理</h3>
            <p>紧急事故处理</p>
          </NavLink>
        </li>
        <li>
          <NavLink path="/contact-us/consultancy">
            <h3>技术专家交流</h3>
            <p>业务咨询、技术交流</p>
          </NavLink>
        </li>
        <li>
          <NavLink path="/contact-us/cooperation">
            <h3>社区生态合作</h3>
            <p>技术合作、社区活动</p>
          </NavLink>
        </li>
        <li>
          <h3>商业咨询</h3>
          <p>4006790886</p>
        </li>
      </ul>
    </Styled.PopoverContainer>
  );

  const popoverProps = {
    content,
    trigger: 'hover',
    placement: 'leftBottom',
    overlayClassName: appClassName,
  };

  return (
    <>
      <GlobalStyle />
      <Popover {...popoverProps}>
        <Styled.Container className={appClassName}>
          <Icon />
        </Styled.Container>
      </Popover>
    </>
  );
};

export default ContactUs;
