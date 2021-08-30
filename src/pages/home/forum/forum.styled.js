import styled, { css } from 'styled-components';
import { colors } from '@tidb-community/ui';

import AsktugSvg from './asktug.svg';
import { ModuleTitle, Section } from '~/pages/home/index.styled';

export { ModuleTitle } from '~/pages/home/index.styled';

export const Container = styled(Section)`
  && {
    background: ${colors.M2};
  }
`;

export const Posts = styled.div`
  margin-bottom: 1rem;
`;

export const Module = styled.div`
  text-align: center;
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid ${colors.T2};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: 0;
  }

  p {
    margin-bottom: 2rem;
  }
`;

export const CenterableModuleTitle = styled(ModuleTitle)`
  ${(props) =>
    props.isSmallScreen &&
    css`
      justify-content: center;
    `}
`;

export const AsktugLogo = styled(AsktugSvg)`
  height: 29.5px;
  margin-right: 1rem;
  position: relative;
  top: 8px;
`;
