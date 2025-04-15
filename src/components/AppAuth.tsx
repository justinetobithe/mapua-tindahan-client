'use client';
import React, { FC } from 'react';
import useStore from '@/store/useStore';
import isset from '@/utils/isset';

const AppAuth: FC<{ dashboard: React.ReactNode; login: React.ReactNode }> = ({
  dashboard,
  login,
}) => {
  const { user } = useStore((state) => ({
    user: state.user.data,
  }));
  console.log('user: ', user);
  return isset(user?.id) ? dashboard : login;
};

export default AppAuth;
