'use server';
/**
 * @fileOverview An AI debater that provides fact-based counterarguments.
 *
 * - debateWithFactBasedArguments - A function that handles the debate process.
 * - DebateInput - The input type for the debateWithFactBasedArguments function.
 * - DebateOutput - The return type for the debateWithFactBasedArguments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebateInputSchema = z.object({
  topic: z.string().describe('The topic to debate.'),
  userClaim: z.string().describe('The user claim on a given topic.'),
});
export type DebateInput = z.infer<typeof DebateInputSchema>;

const DebateOutputSchema = z.object({
  rebuttal: z.string().describe('A fact-based counterargument to the user claim.'),
  sources: z.string().optional().describe('Sources for the counterargument, if available.'),
});
export type DebateOutput = z.infer<typeof DebateOutputSchema>;

export async function debateWithFactBasedArguments(input: DebateInput): Promise<DebateOutput> {
  return debateFlow(input);
}

const debatePrompt = ai.definePrompt({
  name: 'debatePrompt',
  input: {schema: DebateInputSchema},
  output: {schema: DebateOutputSchema},
  prompt: `You are an AI acting as a devil\'s advocate in a debate.

  The user will provide a claim on a topic, and you will provide a fact-based counterargument.
  If possible, provide sources for your counterargument.

  Topic: {{{topic}}}
  User Claim: {{{userClaim}}}

  Provide a rebuttal to the user claim, and include sources if possible:
  {
    "rebuttal": "[Fact-based counterargument]",
    "sources": "[Source URL or citation]"
  }`,
});

const debateFlow = ai.defineFlow(
  {
    name: 'debateFlow',
    inputSchema: DebateInputSchema,
    outputSchema: DebateOutputSchema,
  },
  async input => {
    const {output} = await debatePrompt(input);
    return output!;
  }
);
