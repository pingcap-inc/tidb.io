import styled from 'styled-components';
import { colors } from '@tidb-community/ui';

export const SupportForm = styled('form')`
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  max-width: 759px;
  background: #ffffff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 48px 76px;
  position: relative;
`;

export const SupportFormDescription = styled('p')`
  font-size: 16px;
  line-height: 22.4px;
  text-align: center;
`;

export const SupportFormRequiredLabel = styled('span')`
  &:before {
    display: inline-block;
    margin-right: 4px;
    color: ${colors.AntD.error};
    font-size: 14px;
    font-family: 'SimSun,sans-serif';
    line-height: 1;
    content: '*';
  }
`;
