import { useCallback, useEffect, useState } from 'react';
import { api } from '@tidb-community/datasource';
import { message } from 'antd';

export const usePrincipal = () => {
  const [id, setId] = useState(undefined);
  const [roles, setRoles] = useState([]);
  const [authorities, setAuthorities] = useState([]);

  useEffect(() => {
    api.blog.common
      .principal()
      .then(({ id, roles, authorities }) => {
        setId(id);
        setRoles(roles);
        setAuthorities(authorities);
      })
      .catch((e) => {
        return message.error(String(e?.message ?? e));
      });
  }, []);

  const hasRole = useCallback(
    (auth) => {
      return roles.indexOf(auth) >= 0;
    },
    [roles]
  );

  const hasAuthority = useCallback(
    (auth) => {
      return authorities.indexOf(auth) >= 0;
    },
    [authorities]
  );

  const isAuthor = useCallback(
    (target) => {
      return id !== undefined && (target.authorId === id || target.author?.id === id);
    },
    [id]
  );

  return { roles, authorities, hasRole, hasAuthority, isAuthor };
};
