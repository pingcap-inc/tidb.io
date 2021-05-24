import React from 'react';
import { Col, Row } from 'antd';

import * as Styled from './layout.styled';
import Menu from './menu';
import { CoreLayout } from '~/layouts';

const Layout = ({ children }) => {
  return (
    <CoreLayout domain="tidb.io" hasMargin>
      <Styled.Container>
        <Row gutter={32}>
          <Col xs={12} sm={8} md={6}>
            <Menu />
          </Col>
          <Col xs={12} sm={16} md={18}>
            {children}
          </Col>
        </Row>
      </Styled.Container>
    </CoreLayout>
  );
};

export default Layout;
