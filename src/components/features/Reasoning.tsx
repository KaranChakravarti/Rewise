"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { provideReasoningChallengeWithExplanation, type ProvideReasoningChallengeWithExplanationInput } from '@/ai/flows/provide-reasoning-challenges-with-explanations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, Sparkles, Volume2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Textarea } from '../ui/textarea';
import { Label } from '@/components/ui/label';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { VoiceInputButton } from '@/components/voice-input-button';

const formSchema = z.object({
  category: z.enum(['mathematical', 'logical', 'tricky']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export default function Reasoning() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<{ problem: string, solution: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const { playAudio, isPlaying, playingText } = useAudioPlayback();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: 'logical', difficulty: 'medium' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setChallenge(null);
    setUserAnswer('');
    setIsSolutionVisible(false);

    try {
      const result = await provideReasoningChallengeWithExplanation(values);
      if (result && result.problem && result.solution) {
        setChallenge(result);
        playAudio(`Here is your challenge: ${result.problem}`);
      } else {
        setError('The AI could not generate a challenge. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const startNewChallenge = () => {
    setChallenge(null);
    setUserAnswer('');
    setIsSolutionVisible(false);
    setError(null);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reasoning Challenges</CardTitle>
        <CardDescription>Test your problem-solving skills.</CardDescription>
      </CardHeader>
      <CardContent>
        {!challenge ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mathematical">Mathematical</SelectItem>
                          <SelectItem value="logical">Logical</SelectItem>
                          <SelectItem value="tricky">Tricky</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Challenge
              </Button>
            </form>
          </Form>
        ) : (
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold mb-2">Problem:</h3>
                        <Button variant="ghost" size="icon" onClick={() => playAudio(challenge.problem)} disabled={isPlaying}>
                            <Volume2 className={`h-5 w-5 ${isPlaying && playingText === challenge.problem ? 'text-primary' : '' }`} />
                        </Button>
                    </div>
                    <p className="whitespace-pre-wrap">{challenge.problem}</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="user-answer">Your Answer</Label>
                    <div className="relative">
                        <Textarea 
                            id="user-answer"
                            placeholder="Type your reasoning and answer here..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="min-h-[100px] pr-10"
                        />
                        <VoiceInputButton onTranscript={setUserAnswer} isProcessing={isLoading} />
                    </div>
                </div>
                <Collapsible open={isSolutionVisible} onOpenChange={setIsSolutionVisible}>
                    <CollapsibleTrigger asChild>
                         <Button variant="outline">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isSolutionVisible ? 'Hide' : 'Show'} AI Explanation
                         </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="mt-4 p-4 bg-muted rounded-lg border">
                           <div className="flex items-center justify-between">
                                <h4 className="font-semibold mb-2">Step-by-Step Solution:</h4>
                                <Button variant="ghost" size="icon" onClick={() => playAudio(challenge.solution)} disabled={isPlaying}>
                                    <Volume2 className={`h-5 w-5 ${isPlaying && playingText === challenge.solution ? 'text-primary' : '' }`} />
                                </Button>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">{challenge.solution}</p>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        )}

        {isLoading && (
            <div className="flex flex-col items-center gap-4 text-center mt-6">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating your challenge...</p>
            </div>
        )}

        {error && (
            <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
      {challenge && (
        <CardFooter>
            <Button variant="secondary" onClick={startNewChallenge}>Get New Challenge</Button>
        </CardFooter>
      )}
    </Card>
  );
}
