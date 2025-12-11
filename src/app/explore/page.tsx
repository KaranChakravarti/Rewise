import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizWiz from '@/components/features/QuizWiz';
import Interviewer from '@/components/features/Interviewer';
import DevilsAdvocate from '@/components/features/DevilsAdvocate';
import CuratedResources from '@/components/features/CuratedResources';
import Reasoning from '@/components/features/Reasoning';
import { FileQuestion, MessagesSquare, Scale, Search, BrainCircuit } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Features',
  description: 'Explore the AI-powered learning tools offered by ReWise.',
};

const features = [
  {
    value: 'quiz',
    title: 'QuizWiz',
    icon: FileQuestion,
    component: <QuizWiz />,
  },
  {
    value: 'interviewer',
    title: 'Interviewer',
    icon: MessagesSquare,
    component: <Interviewer />,
  },
  {
    value: 'debate',
    title: "Devil's Advocate",
    icon: Scale,
    component: <DevilsAdvocate />,
  },
  {
    value: 'resources',
    title: 'Fact_get',
    icon: Search,
    component: <CuratedResources />,
  },
  {
    value: 'reasoning',
    title: 'Reasoning',
    icon: BrainCircuit,
    component: <Reasoning />,
  },
];

export default function ExplorePage() {
  return (
    <div className="container py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
          Explore Our Tools
        </h1>
        <p className="text-muted-foreground md:text-lg">
          <p> Explore our tools </p>
          <p> Discover the AI-powered learning tools offered by ReWise to enhance your study experience. </p>
        </p>
        <p className="text-muted-foreground md:text-lg">
          
          <a href="https://debate-ai-lemon-eta.vercel.app/" target="_blank" rel="noopener noreferrer">
            Visit The Debate AI App
            </a><br/>
            <a href="https://qwizgame-iad6.vercel.app/" target="_blank" rel="noopener noreferrer">
            Visit The QuizWiz App
            </a>
        </p>
      </div>

      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          {features.map((feature) => (
            <TabsTrigger key={feature.value} value={feature.value} className="flex flex-col sm:flex-row gap-2 h-auto py-2">
              <feature.icon className="h-5 w-5" />
              <span>{feature.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {features.map((feature) => (
          <TabsContent key={feature.value} value={feature.value} className="pt-6">
            {feature.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
