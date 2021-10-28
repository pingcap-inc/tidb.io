import styled from 'styled-components';
import { Styled, colors } from '@tidb-community/ui';

export { Module } from '~/pages/home/forum/forum.styled';

const { ModuleTitle, Section, CenterOnSmallScreen } = Styled;

export { ModuleTitle, CenterOnSmallScreen };

export const Container = styled(Section)`
  background: ${colors.M2};
`;

export const Blogs = styled.div`
  margin-bottom: 1rem;
`;
