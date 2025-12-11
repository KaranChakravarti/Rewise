'use server';

/**
 * @fileOverview A reasoning challenge AI agent that creates problems and provides step-by-step solutions.
 *
 * - provideReasoningChallengeWithExplanation - A function that handles the reasoning challenge process.
 * - ProvideReasoningChallengeWithExplanationInput - The input type for the provideReasoningChallengeWithExplanation function.
 * - ProvideReasoningChallengeWithExplanationOutput - The return type for the provideReasoningChallengeWithExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideReasoningChallengeWithExplanationInputSchema = z.object({
  category: z
    .enum(['mathematical', 'logical', 'tricky'])
    .describe('The category of the reasoning challenge.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty of the reasoning challenge.'),
});
export type ProvideReasoningChallengeWithExplanationInput = z.infer<
  typeof ProvideReasoningChallengeWithExplanationInputSchema
>;

const ProvideReasoningChallengeWithExplanationOutputSchema = z.object({
  problem: z.string().describe('The reasoning problem.'),
  solution: z.string().describe('The step-by-step explanation of the solution.'),
});
export type ProvideReasoningChallengeWithExplanationOutput = z.infer<
  typeof ProvideReasoningChallengeWithExplanationOutputSchema
>;

export async function provideReasoningChallengeWithExplanation(
  input: ProvideReasoningChallengeWithExplanationInput
): Promise<ProvideReasoningChallengeWithExplanationOutput> {
  return provideReasoningChallengeWithExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideReasoningChallengeWithExplanationPrompt',
  input: {schema: ProvideReasoningChallengeWithExplanationInputSchema},
  output: {schema: ProvideReasoningChallengeWithExplanationOutputSchema},
  prompt: `You are an AI that specializes in creating reasoning challenges and providing detailed, step-by-step explanations.

  Create a reasoning problem of the following category: {{{category}}}.
  The difficulty of the problem should be: {{{difficulty}}}.

  Provide a detailed, step-by-step explanation of the solution.

  Format your response as follows:

  Problem: [Reasoning Problem]
  Solution: [Step-by-step solution]`,
});

const provideReasoningChallengeWithExplanationFlow = ai.defineFlow(
  {
    name: 'provideReasoningChallengeWithExplanationFlow',
    inputSchema: ProvideReasoningChallengeWithExplanationInputSchema,
    outputSchema: ProvideReasoningChallengeWithExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
