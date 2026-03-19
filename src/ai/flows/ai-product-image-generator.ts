'use server';
/**
 * @fileOverview A generative AI tool that generates professional product images using Imagen 4.
 *
 * - aiProductImageGenerator - A function that handles the image generation process.
 * - AiProductImageGeneratorInput - The input type for the aiProductImageGenerator function.
 * - AiProductImageGeneratorOutput - The return type for the aiProductImageGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductImageGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
});
export type AiProductImageGeneratorInput = z.infer<typeof AiProductImageGeneratorInputSchema>;

const AiProductImageGeneratorOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
});
export type AiProductImageGeneratorOutput = z.infer<typeof AiProductImageGeneratorOutputSchema>;

export async function aiProductImageGenerator(input: AiProductImageGeneratorInput): Promise<AiProductImageGeneratorOutput> {
  return aiProductImageGeneratorFlow(input);
}

const aiProductImageGeneratorFlow = ai.defineFlow(
  {
    name: 'aiProductImageGeneratorFlow',
    inputSchema: AiProductImageGeneratorInputSchema,
    outputSchema: AiProductImageGeneratorOutputSchema,
  },
  async input => {
    const prompt = `A professional, high-resolution commercial studio photograph of ${input.productName}. 
    The item is a ${input.category} product. 
    It should be centered, with clean studio lighting, high contrast, and a minimalist neutral background suitable for a premium e-commerce marketplace like Z-MART. 
    No text, no watermarks, professional product photography style.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate product image');
    }

    return {
      imageUrl: media.url,
    };
  }
);
