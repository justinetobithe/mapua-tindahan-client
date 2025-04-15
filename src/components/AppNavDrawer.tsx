'use client';
import React, { FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Applogo from '@public/img/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { useLogout } from '@/lib/AuthenticationAPI';
import routes from '@/utils/routes';

const AppNavDrawer: FC = () => {
  const { data: session } = useSession();

  const { mutate, isSuccess } = useLogout();

  useEffect(() => {
    if (isSuccess) {
      signOut({
        callbackUrl: '/login',
      });
    }
  }, [isSuccess]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='inline-block pl-2 pr-0 active:translate-y-[-1px]'>
            <Menu size='1.8rem' className='mr-2' />
          </Button>
        </SheetTrigger>
        <Link href={`/dashboard`} className='inline-block'>
          <Image src={Applogo} width={100} height={100} alt='App Logo' />
        </Link>
        <SheetContent side='left' className='p-0'>
          <div className='flex h-full flex-col justify-between'>
            <div className='mb-6 flex flex-col items-center justify-center bg-primary p-4 text-center'>
              <Avatar className='h-20 w-20'>
                <AvatarImage
                  asChild
                  className='inline-block rounded-full'
                  src='/img/avatar.png'
                >
                  <Image
                    src='/img/avatar.png'
                    alt='logo'
                    width={80}
                    height={80}
                  />
                </AvatarImage>
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h5 color='blue-gray' className='mt-1 font-bold'>
                {session ? session.user?.name : ''}
              </h5>
              <p className='text-xs'>{session ? session.user?.email : ''}</p>
            </div>
            <div className='flex-1 px-4'>
              {session?.user &&
                routes
                  .filter(
                    (item) =>
                      item.roles.includes(session.user.role) && item.isSidebarVisible
                  )
                  .map((item) => (
                    <SheetClose key={item.route} asChild>
                      <Button
                        asChild
                        className='text-md mb-3 w-full rounded-full font-bold shadow-lg'
                      >
                        <Link href={item.route}>
                          {item.icon}
                          <span className='ml-2'>{item.title}</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
            </div>
            <div className='mb-5 px-4'>
              <SheetClose asChild>
                <Button
                  className='w-full rounded-full'
                  onClick={() => {
                    mutate();
                  }}
                >
                  <LogOut /> SIGN OUT
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AppNavDrawer;
