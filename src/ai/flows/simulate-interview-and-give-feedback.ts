'use server';
/**
 * @fileOverview An AI Interview Simulator flow.
 *
 * - simulateInterviewAndGiveFeedback - A function that simulates an interview and provides feedback.
 * - SimulateInterviewAndGiveFeedbackInput - The input type for the simulateInterviewAndGiveFeedback function.
 * - SimulateInterviewAndGiveFeedbackOutput - The return type for the simulateInterviewAndGiveFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateInterviewAndGiveFeedbackInputSchema = z.object({
  topic: z.string().describe('The topic for the interview.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the interview.'),
  answer: z.string().optional().describe('The user provided answer to the current question.'),
  question: z.string().optional().describe('The current interview question.'),
  conversationHistory: z.string().optional().describe('The conversation history for more conversational context.'),
});

export type SimulateInterviewAndGiveFeedbackInput = z.infer<typeof SimulateInterviewAndGiveFeedbackInputSchema>;

const SimulateInterviewAndGiveFeedbackOutputSchema = z.object({
  question: z.string().describe('The next interview question.'),
  feedback: z.string().describe('The feedback on the user provided answer.'),
  conversationHistory: z.string().describe('The conversation history for more conversational context.'),
  isFinished: z.boolean().describe('Whether the interview is finished.'),
});

export type SimulateInterviewAndGiveFeedbackOutput = z.infer<typeof SimulateInterviewAndGiveFeedbackOutputSchema>;

export async function simulateInterviewAndGiveFeedback(input: SimulateInterviewAndGiveFeedbackInput): Promise<SimulateInterviewAndGiveFeedbackOutput> {
  return simulateInterviewAndGiveFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateInterviewAndGiveFeedbackPrompt',
  input: {schema: SimulateInterviewAndGiveFeedbackInputSchema},
  output: {schema: SimulateInterviewAndGiveFeedbackOutputSchema},
  prompt: `You are an AI interviewer. Your task is to conduct a mock interview with the user on the topic of {{topic}} at the difficulty level of {{difficulty}}. The user has provided the following answer to the previous question: {{answer}}. The previous question was: {{question}}. The conversation history is: {{conversationHistory}}. Provide the next interview question and give immediate feedback on the user's answer, including strengths, areas for improvement, and suggested phrases.  If the user has not provided an answer yet, generate the first question. If the interview is finished, set isFinished to true. If you are generating a question, set isFinished to false. Return your answer in JSON format.

Here is an example of the output format:
{
  "question": "What are your strengths?",
  "feedback": "Your answer was good. Here are some strengths, areas for improvement, and suggested phrases.",
  "conversationHistory": "Interviewer: What are your strengths?\nUser: I am a hard worker.\nInterviewer: Your answer was good. Here are some strengths, areas for improvement, and suggested phrases.",
  "isFinished": false
}

If the interview is finished, say "The interview is finished."
`,
});

const simulateInterviewAndGiveFeedbackFlow = ai.defineFlow(
  {
    name: 'simulateInterviewAndGiveFeedbackFlow',
    inputSchema: SimulateInterviewAndGiveFeedbackInputSchema,
    outputSchema: SimulateInterviewAndGiveFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      conversationHistory: input.conversationHistory ? input.conversationHistory : '',
    });

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(output!.feedback);
    } catch (e) {
      console.error("Failed to parse JSON from the output, returning raw output", e);
      return {
        question: "There was an error during generation.  Please try again later.",
        feedback: output!.feedback,
        conversationHistory: input.conversationHistory ? input.conversationHistory : '',
        isFinished: true,
      };
    }

    return {
      question: parsedOutput.question,
      feedback: parsedOutput.feedback,
      conversationHistory: input.conversationHistory ? input.conversationHistory + `Interviewer: ${parsedOutput.question}\nUser: ${input.answer}\nInterviewer: ${parsedOutput.feedback}\n` : `Interviewer: ${parsedOutput.question}\n`, // creates a message chain
      isFinished: parsedOutput.isFinished
    };
  }
);
