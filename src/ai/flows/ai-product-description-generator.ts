
'use server';
/**
 * @fileOverview A generative AI tool that assists business owners in creating compelling and descriptive product descriptions.
 *
 * - aiProductDescriptionGenerator - A function that handles the product description generation process.
 * - AiProductDescriptionGeneratorInput - The input type for the aiProductDescriptionGenerator function.
 * - AiProductDescriptionGeneratorOutput - The return type for the aiProductDescriptionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductDescriptionGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  keyFeatures: z.array(z.string()).describe('A list of key features for the product.').min(1),
  additionalNotes: z.string().optional().describe('Any additional notes or specific requests for the description style or content.'),
});
export type AiProductDescriptionGeneratorInput = z.infer<typeof AiProductDescriptionGeneratorInputSchema>;

const AiProductDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('The generated compelling and descriptive product description.'),
});
export type AiProductDescriptionGeneratorOutput = z.infer<typeof AiProductDescriptionGeneratorOutputSchema>;

export async function aiProductDescriptionGenerator(input: AiProductDescriptionGeneratorInput): Promise<AiProductDescriptionGeneratorOutput> {
  return aiProductDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProductDescriptionGeneratorPrompt',
  input: {schema: AiProductDescriptionGeneratorInputSchema},
  output: {schema: AiProductDescriptionGeneratorOutputSchema},
  prompt: `You are an expert e-commerce copywriter specializing in creating compelling, high-converting product descriptions for Z-MART, a premium global marketplace. 

Your goal is to write a product description that highlights key features, emphasizes user benefits, and entices customers to make a purchase.

Product Name: {{{productName}}}

Key Features:
{{#each keyFeatures}}- {{{this}}}
{{/each}}

{{#if additionalNotes}}
Additional Style/Context Notes: {{{additionalNotes}}}
{{/if}}

Guidelines:
1. Start with a hook that grabs attention.
2. Focus on the benefits (how it improves the user's life) rather than just the features.
3. Use a tone that is professional, authoritative, yet inviting.
4. Ensure the description is at least 3-4 sentences long.
5. End with a subtle call to value.

Write a compelling and descriptive product description:`,
});

const aiProductDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'aiProductDescriptionGeneratorFlow',
    inputSchema: AiProductDescriptionGeneratorInputSchema,
    outputSchema: AiProductDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate product description');
    }
    return output;
  }
);
