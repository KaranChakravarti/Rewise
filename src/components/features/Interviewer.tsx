"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { simulateInterviewAndGiveFeedback, type SimulateInterviewAndGiveFeedbackInput } from '@/ai/flows/simulate-interview-and-give-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Bot, Sparkles, AlertCircle, Volume2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { VoiceInputButton } from '@/components/voice-input-button';

type Message = {
  role: 'user' | 'assistant' | 'feedback';
  content: string;
};

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export default function Interviewer() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [conversationHistory, setConversationHistory] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const { playAudio, isPlaying, playingText } = useAudioPlayback();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', difficulty: 'medium' },
  });

  const startInterview = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setConversation([]);
    
    try {
      const payload: SimulateInterviewAndGiveFeedbackInput = { ...values };
      const result = await simulateInterviewAndGiveFeedback(payload);
      
      setIsInterviewStarted(true);
      setConversation([{ role: 'assistant', content: result.question }]);
      setCurrentQuestion(result.question);
      setConversationHistory(result.conversationHistory);
      playAudio(result.question);

    } catch (e) {
      setError('An AI error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    setError(null);
    const newUserMessage: Message = { role: 'user', content: userAnswer };
    setConversation(prev => [...prev, newUserMessage]);

    try {
      const payload: SimulateInterviewAndGiveFeedbackInput = {
        topic: form.getValues('topic'),
        difficulty: form.getValues('difficulty'),
        conversationHistory: conversationHistory,
        answer: userAnswer,
        question: currentQuestion,
      };

      const result = await simulateInterviewAndGiveFeedback(payload);

      if (result.isFinished) {
        setConversation(prev => [...prev, { role: 'feedback', content: result.feedback }, { role: 'feedback', content: 'The interview has concluded. Well done!' }]);
        setCurrentQuestion('');
        playAudio(result.feedback + ' The interview has concluded. Well done!');
      } else {
        setConversation(prev => [...prev, { role: 'feedback', content: result.feedback }, { role: 'assistant', content: result.question }]);
        setCurrentQuestion(result.question);
        setConversationHistory(result.conversationHistory);
        playAudio(result.feedback + '. ' + result.question);
      }

    } catch (e) {
      setError('An AI error occurred. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setUserAnswer('');
    }
  };
  
  const restartInterview = () => {
    setIsInterviewStarted(false);
    setConversation([]);
    setCurrentQuestion('');
    setConversationHistory('');
    setError(null);
    form.reset();
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation]);


  if (!isInterviewStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Interview Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(startInterview)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Topic</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="e.g., Frontend Development, Project Management" {...field} />
                        <VoiceInputButton onTranscript={text => field.onChange(text)} isProcessing={isLoading} />
                      </div>
                    </FormControl>
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Interview
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
        <CardTitle>Interview in Progress</CardTitle>
        <Button variant="outline" onClick={restartInterview}>End Interview</Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && (
                  <div className={`p-2 rounded-full h-fit ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-accent/20'}`}>
                    {msg.role === 'assistant' ? <Bot className="h-5 w-5 text-primary" /> : <Sparkles className="h-5 w-5 text-accent" />}
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg p-3 relative group ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.content}</p>
                   {msg.role !== 'user' && (
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
            {isLoading && conversation.length > 0 && <div className="flex justify-start"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
          </div>
        </ScrollArea>
        {error && 
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        }
        <form onSubmit={handleAnswerSubmit} className="flex gap-2 pt-4 border-t">
          <div className="relative flex-grow">
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isLoading || currentQuestion === ''}
              className="flex-grow pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnswerSubmit(e as any);
                }
              }}
            />
            <VoiceInputButton onTranscript={setUserAnswer} isProcessing={isLoading || currentQuestion === ''} />
          </div>
          <Button type="submit" disabled={isLoading || userAnswer.trim() === ''}>Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}
