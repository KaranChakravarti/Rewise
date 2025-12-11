'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions based on a topic and optional source paragraph.
 *
 * - generateQuizQuestions - A function that generates a quiz based on the input.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate quiz questions.'),
  sourceParagraph: z.string().optional().describe('An optional paragraph to use as the source for generating questions.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  questionType: z.enum(['MCQ', 'OpenEnded']).describe('The type of question.'),
  questionText: z.string().describe('The text of the question.'),
  answers: z.array(z.string()).optional().describe('The possible answers for an MCQ question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().describe('A short explanation of the correct answer.'),
  source: z.string().optional().describe('The source of the information for the answer.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('The generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert quiz generator. You will generate a quiz with a mix of MCQ and open-ended questions based on the given topic and optional source paragraph.

  Topic: {{{topic}}}
  {{#if sourceParagraph}}
  Source Paragraph: {{{sourceParagraph}}}
  {{/if}}

  Each question should include a short explanation of the correct answer, and a source if available.

  The output should be a JSON object with a 'questions' array. Each question in the array should have the following properties:
  - questionType (string): 'MCQ' or 'OpenEnded'
  - questionText (string): The text of the question.
  - answers (array of strings, optional): The possible answers for an MCQ question.
  - correctAnswer (string): The correct answer to the question.
  - explanation (string): A short explanation of the correct answer.
  - source (string, optional): The source of the information for the answer.
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateQuizQuestionsPrompt(input);
    return output!;
  }
);
