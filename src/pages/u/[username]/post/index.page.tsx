import * as React from 'react';
// import * as Styled from './index.styled';
import * as CommonStyled from '../common.styled';
import { getI18nProps } from '~/utils/i18n.utils';
import Tab, { EUgcType } from '../_components/Tab';
import ProfileLayout from '../_components/ProfileLayout';
import { GetServerSideProps } from 'next';
import { Pagination, Select, Space } from 'antd';
import ListItem from '../_components/ListItem';
import { HeartOutlined, MessageOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import { getBadgesById, getUserProfileById, IRawBadges } from '../api';
import { getRelativeDatetime } from '~/utils/datetime.utils';

interface IProps {
  badges: IRawBadges[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [i18nProps, badges, profile] = await Promise.all([
    // @ts-ignore
    getI18nProps(['common'])(ctx),
    getBadgesById('cw1997'),
    getUserProfileById('cw1997'),
  ]);
  return { props: { ...i18nProps, badges, profile } };
};

export default function ProfileAnswerPage(props: IProps) {
  const { badges } = props;
  const onChange = () => {
    //  TODO: handle page change
  };
  const date = getRelativeDatetime(new Date('Jan 01,2022 01:02:03'));
  const numsDom = (
    <Space size={24}>
      <div>
        <HeartOutlined /> 16
      </div>
      <div>
        <MessageOutlined /> 16
      </div>
      <div>
        <StarOutlined /> 16
      </div>
      <div>
        <EyeOutlined /> 16
      </div>
    </Space>
  );
  return (
    <ProfileLayout badges={badges}>
      <CommonStyled.Action>
        <Tab selected={EUgcType.post} nums={{ answer: 3, question: 4, post: 5, favorite: 6 }} />
        <Select defaultValue={''}>
          <Select.Option value={''}>文章状态</Select.Option>
          <Select.Option value={'1'}>文章状态</Select.Option>
          <Select.Option value={'2'}>文章状态</Select.Option>
        </Select>
      </CommonStyled.Action>
      <CommonStyled.List>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <ListItem
            key={value}
            url={'#'}
            title={'ansbile升级集群V3到4.0.14问题'}
            summary={
              '这个场景就比较痛苦了，官方后续只会支持tiup 的迭代。。Evict 的策略 是通过 PD 来设定的，目前你出现的问题，基本上都是环境问题了，可能无法解决 :rofl: 这个场景就比较痛苦了，官方后续只会支持tiup 的迭代。。Evict 的策略 是通过 PD 来设定的，目前你出现的问题，基本上都是环境问题了，可能无法解决 :rofl:'
            }
            metadataStart={numsDom}
            metadataEnd={date}
          />
        ))}
      </CommonStyled.List>
      <CommonStyled.Pagination>
        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
      </CommonStyled.Pagination>
    </ProfileLayout>
  );
}
