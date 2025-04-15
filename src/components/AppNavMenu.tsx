import React, { FC } from 'react';
import AppNavDrawer from './AppNavDrawer';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';

const AppNavMenu: FC = async () => {
  const session = await getServerSession(AuthOptions);
  return (
    <nav className='mt-1'>
      <ul className='flex items-center justify-center'>
        <li className='inline-block'>
          <AppNavDrawer />
        </li>
        <li className='ml-auto inline-block pr-5'>
          <p>
            Welcome,{' '}
            <span className='font-bold'>
              {session
                ? session?.user.role.charAt(0).toUpperCase() +
                session?.user.role.slice(1)
                : ''}
            </span>
          </p>
        </li>
      </ul>
    </nav>
  );
};

export default AppNavMenu;
