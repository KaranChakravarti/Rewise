'use server';

/**
 * @fileOverview A flow to curate learning resources based on a given interest area.
 *
 * - curateLearningResources - A function that handles the curation of learning resources.
 * - CurateLearningResourcesInput - The input type for the curateLearningResources function.
 * - CurateLearningResourcesOutput - The return type for the curateLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurateLearningResourcesInputSchema = z.object({
  interestArea: z.string().describe('The area of interest for learning resources.'),
});
export type CurateLearningResourcesInput = z.infer<typeof CurateLearningResourcesInputSchema>;

const CurateLearningResourcesOutputSchema = z.object({
  resources: z
    .array(z.object({
      title: z.string().describe('The title of the resource.'),
      description: z.string().describe('A short description of the resource.'),
      link: z.string().url().describe('The URL of the resource.'),
      tags: z.array(z.string()).describe('Tags associated with the resource.'),
      date: z.string().describe('Date of the resource.'),
    }))
    .describe('A list of curated learning resources.'),
});
export type CurateLearningResourcesOutput = z.infer<typeof CurateLearningResourcesOutputSchema>;

export async function curateLearningResources(
  input: CurateLearningResourcesInput
): Promise<CurateLearningResourcesOutput> {
  return curateLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curateLearningResourcesPrompt',
  input: {schema: CurateLearningResourcesInputSchema},
  output: {schema: CurateLearningResourcesOutputSchema},
  prompt: `You are an AI assistant specializing in curating learning resources for students.

  Based on the student's interest area, you will provide a list of relevant tools, technologies, and resources.
  Each resource should include a title, a short description, a URL, tags (e.g., "Free for students", "Tool", "Research"), and the date.

  Interest Area: {{{interestArea}}}

  Format the output as a JSON object with a "resources" array. Each object in the array should have 'title', 'description', 'link', 'tags', and 'date' fields.  The "resources" field must be an array.
  The output should be a valid JSON.
  `,
});

const curateLearningResourcesFlow = ai.defineFlow(
  {
    name: 'curateLearningResourcesFlow',
    inputSchema: CurateLearningResourcesInputSchema,
    outputSchema: CurateLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
