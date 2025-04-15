'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>Error: {error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
