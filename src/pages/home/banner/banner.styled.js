import styled from 'styled-components';
import { colors, mixins } from '@tidb-community/ui';
import { Button, Col } from 'antd';

import LogoSvg from './logo.svg';
import { Section } from '~/pages/home/index.styled';

export const Container = styled(Section)`
  && {
    color: ${colors.M1};
    background: ${colors.B4};
    padding: 5rem 0 7.5rem;
  }
`;

export const Content = styled.div`
  ${mixins.responsive()};
  width: 100%;
`;

export const LeftPanel = styled(Col).attrs({
  md: 10,
  lg: 8,
})``;

export const RightPanel = styled(Col).attrs({
  md: 14,
  lg: 12,
})``;

export const Logo = styled(LogoSvg)`
  max-width: 350px;
  margin-bottom: 0.5rem;
`;

export const Intro = styled.p`
  ${mixins.reset()};
  color: ${colors.M1};
  font-size: 20px;
  margin-bottom: 2rem;
`;

export const TryButton = styled(Button).attrs({
  type: 'primary',
  size: 'large',
})`
  width: 142px;
  border-radius: 6px;

  span {
    font-size: 18px;
  }
`;

const githubBlack = '#24292e';
const githubLightGrey = '#f0f0f0';

export const StarButton = styled.span`
  ${mixins.verticalLineMiddle('26px')};
  font-size: 14px;
  display: inline-block;
  border-radius: 4px;
  padding: 0 8px;
  background: ${githubLightGrey};
  color: ${githubBlack};
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;

  .anticon {
    font-size: 16px;
    margin-right: 5px;
  }
`;
