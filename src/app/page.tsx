import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <div className="flex flex-col gap-16 md:gap-24">
        <Hero />
        <HowItWorks />
      </div>
    </Suspense>
  );
}
