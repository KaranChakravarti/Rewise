import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="container grid place-items-center gap-8 px-4 py-16 text-center md:py-24 lg:py-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
          ReWise — learn smarter with AI
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Practice, interview, debate and reason — powered by AI.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/explore">Explore Features</Link>
      </Button>
    </section>
  );
}
