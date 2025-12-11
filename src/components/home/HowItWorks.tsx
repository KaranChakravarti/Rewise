import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, MessageSquareHeart, Scale } from 'lucide-react';

const steps = [
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: '1. Pick a Feature',
    description:
      'Choose from a suite of AI-powered tools designed to challenge and grow your knowledge.',
  },
  {
    icon: <MessageSquareHeart className="h-8 w-8 text-primary" />,
    title: '2. Interact with AI',
    description:
      'Engage in dynamic conversations, quizzes, and problem-solving sessions with your AI partner.',
  },
  {
    icon: <Scale className="h-8 w-8 text-primary" />,
    title: '3. Review & Improve',
    description:
      'Receive instant, detailed feedback to understand your strengths and areas for improvement.',
  },
];

export default function HowItWorks() {
  return (
    <section className="container space-y-8 py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
          How It Works
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Start learning in three simple steps.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {step.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
