import Team from '@/components/about/Team';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet the team behind ReWise.',
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
          Meet the Team
        </h1>
        <p className="text-muted-foreground md:text-lg">
          The passionate minds behind the ReWise AI learning platform.
        </p>
      </div>
      <Team />
      <div className="mt-16 flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold">Want to join us?</h2>
        <p className="text-muted-foreground">
          We are always looking for talented individuals to help us build the future of learning.
        </p>
        <Button asChild>
          <Link href="#">Contact / Join Us</Link>
        </Button>
      </div>
    </div>
  );
}
