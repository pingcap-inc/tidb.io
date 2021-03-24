import styled from 'styled-components';

import * as colors from '../../colors';
import * as mixins from '../../mixins';

export const Card = styled.div`
  ${mixins.boxShadow()};
  height: 400px;
  border: 1px solid ${colors.T2};
  cursor: pointer;
`;

export const Image = styled.div`
  img {
    ${mixins.size('100%', '200px')};
    object-fit: cover;
  }
`;

export const Content = styled.div`
  padding: 1.5rem 2rem;
`;

export const Title = styled.h3`
  ${mixins.reset()};
  ${mixins.typography('h2')};
  ${mixins.lineClamp(2)};
  margin-bottom: 1rem;
`;

export const Desc = styled.p`
  ${mixins.reset()};
  ${mixins.typography('p2')};
  ${mixins.lineClamp(3)};
`;
