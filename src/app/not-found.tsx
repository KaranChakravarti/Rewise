import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex h-full min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-extrabold tracking-tighter text-primary/20">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Page Not Found
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
