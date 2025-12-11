"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { curateLearningResources, type CurateLearningResourcesOutput } from '@/ai/flows/curate-learning-resources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, Bookmark, Mail, ExternalLink, Volume2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { VoiceInputButton } from '@/components/voice-input-button';

type Resource = CurateLearningResourcesOutput['resources'][0];

const formSchema = z.object({
  interestArea: z.string().min(3, 'Interest area must be at least 3 characters.'),
});

export default function CuratedResources() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[] | null>(null);
  const { toast } = useToast();
  const { playAudio, isPlaying, playingText } = useAudioPlayback();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { interestArea: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResources(null);

    try {
      const result = await curateLearningResources(values);
      if (result && result.resources && result.resources.length > 0) {
        setResources(result.resources);
      } else {
        setError('The AI could not find resources for this interest area. Please try a different one.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBookmark = () => {
    toast({ title: "Stub Action", description: "Bookmark functionality is not yet implemented." });
  };
  
  const handleSendToEmail = () => {
    toast({ title: "Stub Action", description: "Send to email functionality is not yet implemented." });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Learning Resources</CardTitle>
          <CardDescription>Discover tools, tech, and free resources for your interests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="interestArea"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="e.g., 'AI for students'" {...field} />
                        <VoiceInputButton
                          onTranscript={text => field.onChange(text)}
                          isProcessing={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="sm:w-auto w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Resources
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Curating resources for you...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {resources && (
        <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold">Results for "{form.getValues('interestArea')}"</h2>
          {resources.map((resource, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    <h3 className="font-semibold text-lg flex items-center gap-2">{resource.title} <ExternalLink className="h-4 w-4 text-muted-foreground" /></h3>
                  </a>
                  <p className="text-muted-foreground text-sm mt-1">{resource.description}</p>
                   <div className="flex flex-wrap gap-2 mt-3">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                    <Badge variant="outline">{new Date(resource.date).toLocaleDateString()}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 mt-4 sm:mt-0">
                  <Button variant="ghost" size="icon" onClick={() => playAudio(resource.title + '. ' + resource.description)} disabled={isPlaying} aria-label="Listen to resource details">
                    <Volume2 className={`h-5 w-5 ${isPlaying && playingText === (resource.title + '. ' + resource.description) ? 'text-primary' : '' }`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleBookmark} aria-label="Bookmark resource">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSendToEmail} aria-label="Send to email">
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
