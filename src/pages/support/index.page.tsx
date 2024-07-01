import { Spin } from 'antd';
import React, { useContext } from 'react';
import { CommunityHead } from '~/components';
import Container from '~/components/Container';
import { MeContext } from '~/context';
import { CoreLayout } from '~/layouts';
import { AuthorizedForm } from '~/pages/support/_components/AuthorizedForm';
import {
  SupportHeading,
  SupportHeadingHeadline,
  SupportHeadingTitle,
} from '~/pages/support/_components/SupportHeading';
import { UnauthorizedForm } from '~/pages/support/_components/UnauthorizedForm';
import DecorateImg from './_components/decorate.png';

function SupportPage() {
  const { isMeValidating, meData } = useContext(MeContext);

  const isLoadingMeData = !meData && isMeValidating;

  return (
    <CoreLayout backgroundColor="#e9eaee">
      <CommunityHead
        title={'商业支持咨询'}
        description={
          '要了解规划/实施/主动式巡检/故障协查/数据库迁移/重要时期保障等服务？\n' +
          '想要获得商业专家产品最高响应级别 7*24 支持服务？'
        }
      />
      <Container>
        <SupportHeading>
          <SupportHeadingTitle>商业支持咨询</SupportHeadingTitle>
          <SupportHeadingHeadline>
            想要了解<strong>规划/实施/主动式巡检/故障协查/数据库迁移/重要时期保障</strong>等服务？
            <br />
            想要获得商业专家产品最高响应级别 <strong>7*24 支持服务</strong>？
          </SupportHeadingHeadline>
        </SupportHeading>
        <Spin spinning={isLoadingMeData} tip="加载中...">
          {meData ? (
            <AuthorizedForm key="authorized" name={meData.username} company={meData.username} />
          ) : (
            <UnauthorizedForm key="unauthorized" />
          )}
        </Spin>
        <img
          alt="装饰图片"
          src={DecorateImg.src}
          width={DecorateImg.width / 2}
          style={{ display: 'block', maxWidth: '100%', margin: '48px auto 0' }}
        />
      </Container>
    </CoreLayout>
  );
}

export default SupportPage;
