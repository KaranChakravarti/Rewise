"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { debateWithFactBasedArguments, type DebateInput } from '@/ai/flows/debate-with-fact-based-arguments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Bot, AlertCircle, ExternalLink, Volume2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { VoiceInputButton } from '@/components/voice-input-button';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: string;
};

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
});

export default function DevilsAdvocate() {
  const [isDebateStarted, setIsDebateStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [topic, setTopic] = useState('');
  const [userClaim, setUserClaim] = useState('');
  const { playAudio, isPlaying, playingText } = useAudioPlayback();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const startDebate = (values: z.infer<typeof formSchema>) => {
    setTopic(values.topic);
    setIsDebateStarted(true);
    const openingLine = `The debate topic is: "${values.topic}". What is your opening statement?`;
    setConversation([{ role: 'assistant', content: openingLine }]);
    playAudio(openingLine);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userClaim.trim()) return;

    setIsLoading(true);
    setError(null);
    const newUserMessage: Message = { role: 'user', content: userClaim };
    setConversation(prev => [...prev, newUserMessage]);

    try {
      const payload: DebateInput = { topic, userClaim };
      const result = await debateWithFactBasedArguments(payload);
      const aiMessage: Message = { role: 'assistant', content: result.rebuttal, sources: result.sources };
      setConversation(prev => [...prev, aiMessage]);
      playAudio(result.rebuttal);
    } catch (e) {
      setError('An AI error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setUserClaim('');
    }
  };
  
  const restartDebate = () => {
    setIsDebateStarted(false);
    setConversation([]);
    setTopic('');
    setError(null);
    form.reset();
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation]);


  if (!isDebateStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Devil's Advocate Debate</CardTitle>
          <CardDescription>Hone your arguments against a fact-based AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(startDebate)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debate Topic</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="e.g., 'Is social media beneficial for society?'" {...field} />
                        <VoiceInputButton onTranscript={text => field.onChange(text)} isProcessing={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Start Debate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col h-[70vh]">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Debating: {topic}</CardTitle>
            <CardDescription>AI is playing Devil's Advocate.</CardDescription>
        </div>
        <Button variant="outline" onClick={restartDebate}>New Topic</Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="p-2 rounded-full h-fit bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg p-3 relative group ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.content}</p>
                   {msg.sources && (
                    <a href={msg.sources} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                      Source
                    </a>
                  )}
                  {msg.role === 'assistant' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio(msg.content)}
                        disabled={isPlaying}
                        className={`absolute -right-10 top-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ${isPlaying && playingText === msg.content ? 'text-primary' : '' }`}
                        aria-label="Listen to message"
                    >
                        <Volume2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                 {msg.role === 'user' && (
                  <div className="p-2 rounded-full bg-muted h-fit">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
          </div>
        </ScrollArea>
        {error && 
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        }
        <form onSubmit={handleClaimSubmit} className="flex gap-2 pt-4 border-t">
          <div className="relative flex-grow">
            <Textarea
              value={userClaim}
              onChange={(e) => setUserClaim(e.target.value)}
              placeholder="Make your argument..."
              disabled={isLoading}
              className="flex-grow pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleClaimSubmit(e as any);
                }
              }}
            />
            <VoiceInputButton onTranscript={setUserClaim} isProcessing={isLoading} />
          </div>
          <Button type="submit" disabled={isLoading || userClaim.trim() === ''}>Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}
