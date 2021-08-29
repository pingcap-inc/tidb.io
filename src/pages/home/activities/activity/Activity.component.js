import Image from 'next/image';
import React from 'react';
import dayjs from 'dayjs';

import * as Styled from './activity.styled';

const Activity = ({ title, img, link, location, type, date, intro, onClick }) => (
  <Styled.Container onClick={onClick(link)}>
    <Styled.ImageWrapper>
      <Image alt={title} src={img} height={155} width={305} />
    </Styled.ImageWrapper>
    <Styled.Content>
      <h3>{title}</h3>
      <Styled.Metadata>{[location, type, dayjs(date).format('YYYY.MM.DD')].join(' | ')}</Styled.Metadata>
      <Styled.Text>{intro}</Styled.Text>
    </Styled.Content>
  </Styled.Container>
);

export default Activity;
