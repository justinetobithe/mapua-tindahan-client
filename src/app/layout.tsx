import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import AppSessionProvider from '@/components/AppSessionProvider';
import AppTanstackProvider from '@/components/AppTanstackProvider';
import inter from '@/app/assets/fonts/inter';

export const metadata: Metadata = {
  title: 'Mapua Tindahan',
  description: 'An online e-commerce platform for Mapúa University students and community — shop locally for school supplies, merchandise, and essentials.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body
          className={`bg-gradient-to-b from-background-primary from-10% via-background-primary via-30% to-background-primary to-90% ${inter.variable} font-sans`}
        >
          <AppSessionProvider>
            <AppTanstackProvider>{children}</AppTanstackProvider>
          </AppSessionProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
