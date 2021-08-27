import styled, { css } from 'styled-components';
import { colors, mixins } from '@tidb-community/ui';

export const Section = styled.div`
  color: ${colors.F1};
  background: ${colors.M1};
  padding: 4rem 0 6rem;

  ${(props) =>
    props.isSmallScreen &&
    css`
      padding: 4rem 0 3rem;
      ${Title} {
        font-size: 24px;
        text-align: center;

        &::after {
          left: 50%;
          bottom: -10px;
          margin-left: -1.5rem;
        }
      }
    `}
`;

export const Content = styled.div`
  ${mixins.responsive()};
  width: 100%;
`;

export const Title = styled.h2`
  font-size: 32px;
  position: relative;
  margin-bottom: 4rem;

  && {
    font-weight: normal;
  }

  &::after {
    ${mixins.size('3rem', '10px')};
    content: '';
    background: ${colors.T1};
    position: absolute;
    bottom: -6px;
    left: 0;
  }
`;

export const ModuleTitle = styled.h3`
  ${mixins.flexVerticalCenter()};
  justify-content: space-between;
  line-height: 1;
  font-size: 20px;
  font-weight: normal !important;
  margin-bottom: 2rem;
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: lighter;
`;
