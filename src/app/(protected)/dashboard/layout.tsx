import React, { FC, ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';

const Layout: FC<{ user: ReactNode; admin: ReactNode }> = async ({
  user,
  admin,
}) => {
  const session = await getServerSession(AuthOptions);

  const renderDashboard = () => {
    switch (session?.user.role) {
      case 'user':
        return user;
      case 'admin':
        return admin;
      default:
        return null;
    }
  };
  return <>{renderDashboard()}</>;
};

export default Layout;
