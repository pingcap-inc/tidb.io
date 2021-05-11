import React, { useContext, useState } from 'react';
import useSWR from 'swr';
import { Button, Modal, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { api } from '@tidb-community/datasource';
import { useRouter } from 'next/router';

import * as Styled from './members.styled';
import * as utils from './members.utils';
import AddModal from './addModal';
import Layout from 'pages/orgs/layout';
import { CommunityHead } from 'components/head';
import { MeContext } from 'context';
import { columns } from './members.data';
import { featureToggle, errors } from 'utils';

export const getServerSideProps = async ({ req }) => {
  const host = process.env.VERCEL_URL || req.headers.host;

  const isEabled = featureToggle.isFeatureEnabled({
    host,
    name: featureToggle.FEATURES.ORGANIZATOIN_MEMBERS,
  });

  if (!isEabled) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const Members = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: membersResp, mutate: mutateMembers } = useSWR(['orgs.org.members', router.query]);
  const { meData } = useContext(MeContext);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const isAdmin = utils.isAdmin(meData);

  const onRoleChange = async ({ id, role }) => {
    try {
      await api.orgs.org.updateMemberRole({ role, slug, userId: id });
      mutateMembers(
        {
          ...membersResp,
          data: membersResp.data.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                role,
              };
            }
            return item;
          }),
        },
        false
      );
    } catch (err) {
      Modal.warn({
        title: '无法更新角色',
        content: errors.getFirstApiErrorMsg(err),
        centered: true,
      });
    }
  };

  const onAddMembers = () => {
    setIsAddModalVisible(true);
  };

  const onDelete = ({ id, isMyself }) => {
    const config = {
      title: '确定要删除该成员吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后，该成员将不在享有企业权益',
      okText: '确定',
      cancelText: '取消',
      centered: true,

      async onOk() {
        try {
          await api.orgs.org.removeMember({ slug, userId: id });

          if (isMyself) {
            router.push('/community', '/');
          }

          mutateMembers(
            {
              ...membersResp,
              data: membersResp.data.filter((item) => item.id !== id),
            },
            false
          );
        } catch (err) {
          Modal.warn({
            title: '无法退出企业',
            content: errors.getFirstApiErrorMsg(err),
            centered: true,
          });
        }
      },
    };

    Modal.confirm({
      ...config,
      ...(isMyself && {
        title: '确定要退出该企业吗？',
        content: '退出企业后将不在享有企业权益',
      }),
    });
  };

  const dataSource = utils.getDataSource({ membersResp, meData, onDelete, onRoleChange, isAdmin });

  const tableProps = {
    dataSource,
    columns,
  };

  const addModalProps = {
    mutateMembers,
    onCancel: () => setIsAddModalVisible(false),
    visible: isAddModalVisible,
  };

  return (
    <>
      <CommunityHead title="企业成员" />

      <Layout>
        <Styled.Header>
          <Styled.Title>
            企业成员<span>{dataSource.length}</span>
          </Styled.Title>

          {isAdmin && (
            <Button type="primary" size="small" onClick={onAddMembers}>
              添加成员
            </Button>
          )}
        </Styled.Header>

        <Table {...tableProps} pagination={false} />
      </Layout>

      <AddModal {...addModalProps} />
    </>
  );
};

export default Members;
