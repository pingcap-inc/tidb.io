import React from 'react';
import Image from 'next/image';

import { CommunityHead } from '~/components';
import Anchor from '~/components/Anchor';
import { CoreLayout } from '~/layouts';

import * as Styled from './index.styled';
import image from './contact-us.png';

const Page = () => {
  return (
    <>
      <CommunityHead
        title={'联系我们'}
        description={
          '我们为每一位来到 TiDB 社区的小伙伴提供帮助。如果你遇到技术问题，想要获得商业支持，或者是想进行社区合作，欢迎在这里联系我们！'
        }
        keyoword={['TiDB 社区', '联系我们', '咨询', '提问', '商业支持', '社区合作']}
      />

      <CoreLayout backgroundColor={'#e9eaee'}>
        <Styled.Content>
          <Styled.Title>Hello! 欢迎来到 TiDB 社区，有什么能帮到你？</Styled.Title>
          <Styled.List>
            <Styled.Card $color={'#F8C200'}>
              <Styled.CardTitle>遇到技术问题</Styled.CardTitle>
              <Styled.CardGroup>
                <Styled.CardParagraph>你可以在论坛和 2w+ 社区小伙伴互相交流问题</Styled.CardParagraph>
                <Styled.CardParagraph>
                  <Anchor href={'https://asktug.com/new-topic'}>&gt; 去发帖</Anchor>
                </Styled.CardParagraph>
              </Styled.CardGroup>
              <Styled.CardGroup>
                <Styled.CardParagraph>如果你想看看别人是否遇到相似的问题，并且已有了解决方案</Styled.CardParagraph>
                <Styled.CardParagraph>
                  <Anchor href={'https://search.asktug.com/'}>&gt; 去搜索</Anchor>
                </Styled.CardParagraph>
              </Styled.CardGroup>
            </Styled.Card>
            <Styled.Card $color={'#F15A24'}>
              <Styled.CardTitle>商业支持</Styled.CardTitle>
              <Styled.CardParagraph>想要获得商业专家产品最高响应级别 7*24 支持服务</Styled.CardParagraph>
              <Styled.CardComment>规划/实施/主动式巡检/故障协查/知识转移/重要时期保障</Styled.CardComment>
              <Styled.CardParagraph>
                <Anchor href="/support">&gt; 商业支持咨询</Anchor>
              </Styled.CardParagraph>
            </Styled.Card>
            <Styled.Card $color={'#E30C34'}>
              <Styled.CardTitle>社区合作</Styled.CardTitle>
              <Styled.CardParagraph>
                TiDB 社区已经和多家社区建立了合作关系，如：思否、开源中国、开源社、infoQ 等。
              </Styled.CardParagraph>
              <Styled.CardParagraph>欢迎来和我们一起做更多有意思的事！</Styled.CardParagraph>
              <Styled.CardParagraph>
                <Anchor href={'/contact-us/cooperation'}>&gt; 填写合作表单</Anchor>
              </Styled.CardParagraph>
            </Styled.Card>
            <Styled.Card $color={'#BE1D32'}>
              <Styled.CardTitle>云数据库 TiDB</Styled.CardTitle>
              <Styled.CardParagraph>
                TiDB 上线阿里云心选商城，带来新一代 HTAP 数据库的云端体验，享受 PingCAP 原厂服务支持。
              </Styled.CardParagraph>
              <Styled.CardParagraph>
                <Anchor
                  href={'https://cn.pingcap.com/events/tidb-on-aliyun/?utm_source=tidb-community&utm_medium=referral'}
                >
                  &gt; 了解更多详情
                </Anchor>
              </Styled.CardParagraph>
            </Styled.Card>
          </Styled.List>
          <Styled.Image>
            <Image {...image} width={600} height={260} alt="" />
          </Styled.Image>
        </Styled.Content>
      </CoreLayout>
    </>
  );
};

export default Page;
