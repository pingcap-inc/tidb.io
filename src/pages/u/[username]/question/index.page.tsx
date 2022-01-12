import * as React from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { Pagination, Select, Space } from 'antd';
import ListItem from '../_components/ListItem';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import {
  getBadgesById,
  getPostUrl,
  getQuestionsById,
  getUserProfileById,
  IProfile,
  IQuestions,
  IRawBadges,
} from '../api';
import { getRelativeDatetime } from '~/utils/datetime.utils';
import { ParsedUrlQuery } from 'querystring';

interface IProps {
  badges: IRawBadges[];
  profile: IProfile;
  questions: IQuestions[];
}
interface IQuery extends ParsedUrlQuery {
  username: string;
  page?: string;
  size?: string;
}

export const getServerSideProps: GetServerSideProps<IProps, IQuery> = async (ctx) => {
  const { username, page, size } = ctx.params;
  const actualPage: number = page !== undefined ? Number(page) ?? 0 : 0;
  const actualSize: number = size !== undefined ? Number(size) ?? 30 : 30;
  const [i18nProps, badges, profile, questions] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesById(username),
    getUserProfileById(username),
    getQuestionsById(username, actualPage, actualSize),
  ]);
  return { props: { ...i18nProps, badges, profile, questions } };
};

export default function ProfileAnswerPage(props: IProps) {
  const { badges, profile, questions } = props;
  const onChange = () => {
    //  TODO: handle page change
  };
  return (
    <ProfileLayout badges={badges} profile={profile}>
      <CommonStyled.Action>
        <Tab selected={EUgcType.question} nums={{ answer: 3, question: 4, post: 5, favorite: 6 }} />
        <Select defaultValue={''}>
          <Select.Option value={''}>提问状态</Select.Option>
          <Select.Option value={'1'}>提问状态</Select.Option>
          <Select.Option value={'2'}>提问状态</Select.Option>
        </Select>
      </CommonStyled.Action>
      <CommonStyled.List>
        {questions.map((value) => (
          <ListItem
            key={value.id}
            url={getPostUrl(value.id, 1)}
            title={value.title}
            summary={''}
            metadataStart={
              <Space size={24}>
                <div>
                  <MessageOutlined /> {value.reply_count}
                </div>
                <div>
                  <EyeOutlined /> {value.views}
                </div>
              </Space>
            }
            metadataEnd={getRelativeDatetime(value.created_at)}
          />
        ))}
      </CommonStyled.List>
      <CommonStyled.Pagination>
        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
      </CommonStyled.Pagination>
    </ProfileLayout>
  );
}
