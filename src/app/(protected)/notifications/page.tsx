import AuthOptions from '@/lib/AuthOptions';
import { getServerSession } from 'next-auth';
import React from 'react';

const Notifications = async () => {
  const session = await getServerSession(AuthOptions);
  return <div>Notifications {session?.user.role}</div>;
};

export default Notifications;
