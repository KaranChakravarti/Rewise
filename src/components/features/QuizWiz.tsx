"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuizQuestions, type GenerateQuizQuestionsOutput, type GenerateQuizQuestionsInput } from '@/ai/flows/generate-quiz-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, AlertCircle, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { VoiceInputButton } from '@/components/voice-input-button';

type QuizQuestion = GenerateQuizQuestionsOutput['questions'][0];

type UserAnswer = {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
};

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  sourceParagraph: z.string().optional(),
});

export default function QuizWiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { playAudio, isPlaying, playingText } = useAudioPlayback();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', sourceParagraph: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);

    try {
      const result = await generateQuizQuestions(values);
      if (result && result.questions && result.questions.length > 0) {
        setQuiz(result.questions);
        playAudio(`Question 1: ${result.questions[0].questionText}`);
      } else {
        setError('The AI could not generate a quiz for this topic. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNextQuestion = () => {
    if (!quiz || selectedAnswer === null) return;
    
    const isCorrect = quiz[currentQuestionIndex].correctAnswer === selectedAnswer;
    setUserAnswers([...userAnswers, { questionIndex: currentQuestionIndex, answer: selectedAnswer, isCorrect }]);
    setSelectedAnswer(null);
    
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    if (quiz[nextIndex]) {
      playAudio(`Question ${nextIndex + 1}: ${quiz[nextIndex].questionText}`);
    }
  };
  
  const handleSkipQuestion = () => {
     if (!quiz) return;
     const nextIndex = currentQuestionIndex + 1;
     setCurrentQuestionIndex(nextIndex);
     if (quiz[nextIndex]) {
        playAudio(`Question ${nextIndex + 1}: ${quiz[nextIndex].questionText}`);
     }
  };

  const restartQuiz = () => {
    setQuiz(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    form.reset();
  };
  
  const score = userAnswers.filter(a => a.isCorrect).length;
  const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);

  if (isLoading) {
    return <div className="flex flex-col items-center gap-4 text-center"><Loader2 className="h-8 w-8 animate-spin" /> <p>Generating your quiz...</p></div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => setError(null)} className="mt-4">Try Again</Button>
      </Alert>
    );
  }

  if (quiz && currentQuestionIndex >= quiz.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-4xl font-bold">{score} / {quiz.length}</p>
          <p className="text-muted-foreground">You got {score} out of {quiz.length} questions correct.</p>
          {incorrectAnswers.length > 0 && (
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Review Incorrect Answers</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Incorrect Answers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                  {incorrectAnswers.map(({questionIndex, answer}) => (
                    <div key={questionIndex} className="p-4 border rounded-lg">
                      <p className="font-semibold">{quiz[questionIndex].questionText}</p>
                      <p className="text-destructive flex items-center gap-2"><XCircle className="h-4 w-4" /> Your answer: {answer}</p>
                      <p className="text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Correct answer: {quiz[questionIndex].correctAnswer}</p>
                      <p className="text-sm text-muted-foreground mt-2">{quiz[questionIndex].explanation}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button onClick={restartQuiz} className="mt-4">Take Another Quiz</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (quiz) {
    const question = quiz[currentQuestionIndex];
    return (
       <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
             <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} className="w-full mb-4" />
             <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                <Button variant="ghost" size="icon" onClick={() => playAudio(question.questionText)} disabled={isPlaying}>
                    <Volume2 className={`h-5 w-5 ${isPlaying && playingText === question.questionText ? 'text-primary' : '' }`} />
                </Button>
             </div>
             <CardTitle>{question.questionText}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.questionType === 'MCQ' && question.answers ? (
              <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''}>
                {question.answers.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer} id={`q${currentQuestionIndex}-a${index}`} />
                    <Label htmlFor={`q${currentQuestionIndex}-a${index}`}>{answer}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
                <div className="relative">
                    <Textarea 
                      placeholder="Type your answer here..."
                      value={selectedAnswer || ''}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="pr-10"
                    />
                    <VoiceInputButton onTranscript={setSelectedAnswer} isProcessing={isLoading} />
                </div>
            )}
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handleSkipQuestion}>Skip</Button>
              <Button onClick={handleNextQuestion} disabled={selectedAnswer === null}>Next Question</Button>
            </div>
          </CardContent>
       </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g., The Roman Empire" {...field} />
                      <VoiceInputButton onTranscript={text => field.onChange(text)} isProcessing={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceParagraph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional: Source Paragraph</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder="Paste a paragraph here to generate questions from it." {...field} className="min-h-[150px] pr-10" />
                      <VoiceInputButton onTranscript={text => field.onChange(text)} isProcessing={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Quiz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
