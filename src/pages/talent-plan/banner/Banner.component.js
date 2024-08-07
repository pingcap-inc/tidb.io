import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import Icon, { GithubOutlined, MailOutlined } from '@ant-design/icons';

import { useIsSmallScreen } from '~/hooks';
import TwoColumnsSection from '~/layouts/twoColumnsSection';
import { getImage } from '~/pages/talent-plan/talent-plan.utils';
import Anchor from '~/components/Anchor';
import AtomGitSvg from './AtomGitSvg';

import * as Styled from './banner.styled';

const AtomGitIcon = (props) => <Icon component={AtomGitSvg} {...props} />;

const Banner = () => {
  const { isSmallScreen, breakpoint } = useIsSmallScreen();

  return (
    <Styled.Container>
      <Styled.Content>
        <TwoColumnsSection
          leftPanel={
            <Styled.LeftPanel>
              <Styled.Title>Talent Plan</Styled.Title>
              <Styled.Intro>
                以 Talent Plan
                开源数据库开发课程为依托，联合优秀高校和企业，建设成对全国各高校数据库开发人才培养的最佳实践平台。既能帮助学习者掌握数据库开发的理论知识，进行实际数据库开发锻炼，又能给与学习者使用开源资源，开发开源软件的培养。
              </Styled.Intro>
              <Space size={24} wrap>
                <Anchor href="https://github.com/pingcap/talent-plan" style={{ fontSize: 24 }}>
                  <Button type={'text'} icon={<GithubOutlined />}>
                    Github 入口
                  </Button>
                </Anchor>
                <Anchor href="https://atomgit.com/pingcap/talent-plan#/" style={{ fontSize: 24 }}>
                  <Button type={'text'} icon={<AtomGitIcon />}>
                    AtomGit 入口
                  </Button>
                </Anchor>
                <Anchor href="mailto:talent-plan@tidb.io" style={{ fontSize: 24 }}>
                  <Tooltip title={'Email: talent-plan@tidb.io'}>
                    <Button type={'text'} icon={<MailOutlined />}>
                      联系我们
                    </Button>
                  </Tooltip>
                </Anchor>
              </Space>
            </Styled.LeftPanel>
          }
          rightPanel={
            <Styled.CarouselWrapper>
              <Styled.Carousel isSmallScreen={isSmallScreen}>
                {[1, 2, 3].map((el) => {
                  const props = {
                    image: getImage(`banner-rec-${el}.svg`),
                    key: el,
                    height: (() => {
                      if (breakpoint.lg) {
                        return 300;
                      }
                      if (breakpoint.md) {
                        return 300;
                      }
                      if (breakpoint.sm) {
                        return 300;
                      }
                      if (breakpoint.xs) {
                        return 200;
                      }
                    })(),
                  };
                  return <Styled.Recommendation {...props} />;
                })}
              </Styled.Carousel>
            </Styled.CarouselWrapper>
          }
        />
      </Styled.Content>
    </Styled.Container>
  );
};

export default Banner;
