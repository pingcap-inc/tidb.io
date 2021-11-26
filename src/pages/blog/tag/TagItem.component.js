import React from 'react';
import Link from 'next/link';
import { Card } from 'antd';

import * as Styled from './TagItem.styled';

const TagItem = ({ name, slug, posts }) => {
  const url = `/blog/tag/${slug}`;
  return (
    <Card title="">
      <Styled.Title>
        <Link href={url}>{`# ${name}`}</Link>
      </Styled.Title>
      <Styled.Footer>{posts ?? 0} 篇文章</Styled.Footer>
    </Card>
  );
};

export default TagItem;