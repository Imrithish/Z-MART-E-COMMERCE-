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
  imageUrl: z.string().describe('The generated image as a data URI or a high-quality fallback URL.'),
  status: z.enum(['success', 'fallback']).describe('The generation status.'),
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
    try {
      const promptText = `A professional, high-resolution commercial studio photograph of ${input.productName}. 
      The item is a ${input.category} product. 
      It should be centered, with clean studio lighting, high contrast, and a minimalist neutral background suitable for a premium e-commerce marketplace like Z-MART. 
      No text, no watermarks, professional product photography style.`;

      const { media } = await ai.generate({
        model: 'googleai/imagen-3.0-generate-001',
        prompt: promptText,
      });

      if (media && media.url) {
        return {
          imageUrl: media.url,
          status: 'success' as const
        };
      }
    } catch (error: any) {
      // Graceful Fallback for plan-restricted environments
      console.warn("Imagen AI restricted or failed. Using high-quality product placeholder.", error.message);
    }

    // Fallback: Generate a consistent, relevant placeholder using picsum seeds
    // We sanitize the product name to create a stable seed
    const stableSeed = input.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return {
      imageUrl: `https://picsum.photos/seed/${stableSeed}/800/800`,
      status: 'fallback' as const
    };
  }
);
