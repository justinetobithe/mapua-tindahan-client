import Link from 'next/link';

export default async function NotFound() {
  return (
    <main className='flex h-screen w-screen items-center justify-center bg-white text-center'>
      <div>
        <h2 className='text-3xl font-bold'>There was a problem</h2>
        <p>We could not found the page you were looking for.</p>
        <p>
          Go back to the{' '}
          <Link
            href={`/`}
            className='font-bold text-primary-foreground underline'
          >
            Homepage
          </Link>
        </p>
      </div>
    </main>
  );
}
