import React, { FC } from 'react';
import Image from 'next/image';
import Logo from '/public/img/logo.png';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import { redirect } from 'next/navigation';
import LoginForm from './components/LoginForm';

const Page: FC = async () => {
  const session = await getServerSession(AuthOptions);

  if (session) {
    redirect('/home');
  }

  return (
    <div className="flex h-screen bg-gray-100"> 
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-white px-10">
        <div className="text-center">
          <Image
            src={Logo}
            alt="Logo"
            width={300}
            height={300}
            className="mx-auto mb-4"
          />
          <p className="text-gray-700 text-sm max-w-sm">
            Discover convenience and quality shopping at your fingertips.
            Welcome to the <strong>Mapúa Tindahan</strong> experience.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center px-4">
        <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md">
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline font-medium">
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
