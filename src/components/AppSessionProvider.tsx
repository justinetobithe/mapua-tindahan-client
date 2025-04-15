'use client';
import { SessionProvider } from 'next-auth/react';

const AppSessionProvider = ({ children }: { children?: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AppSessionProvider;
