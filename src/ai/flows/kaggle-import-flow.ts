'use server';
/**
 * @fileOverview A generative AI flow that simulates fetching and mapping data from a Kaggle-style e-commerce dataset.
 *
 * - syncKaggleData - A function that initiates the data mapping process.
 * - KaggleSyncOutput - The return type containing a batch of mapped products.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  category: z.string(),
  stock: z.number(),
  imageUrl: z.string(),
  rating: z.number(),
  reviews: z.number(),
  features: z.array(z.string()),
  isDeal: z.boolean(),
});

const KaggleSyncOutputSchema = z.object({
  products: z.array(ProductSchema),
});

export type KaggleSyncOutput = z.infer<typeof KaggleSyncOutputSchema>;

export async function syncKaggleData(): Promise<KaggleSyncOutput> {
  return kaggleImportFlow();
}

const prompt = ai.definePrompt({
  name: 'kaggleImportPrompt',
  output: { schema: KaggleSyncOutputSchema },
  prompt: `You are a data engineer specialized in e-commerce datasets (like those from Kaggle, Shein, and Amazon).

Your task is to generate a batch of 15 high-quality, realistic product entries that look like they were exported from a "Shein/Amazon Fashion & Tech" Kaggle dataset.

Requirements:
1. Variety: Include items from Fashion (Dresses, Outerwear), Tech (Mobiles, Audio), Home (Decor, Kitchen), and Beauty.
2. Realism: Prices should be in INR (Indian Rupee). Description should be professional.
3. Features: Each product must have 3-4 specific features.
4. Ratings: Realistic distribution of ratings (3.5 to 5.0) and review counts (hundreds to thousands).
5. Images: Use placeholder URLs: https://picsum.photos/seed/<category-seed>/600/600

Generate a diverse batch of products:`,
});

const kaggleImportFlow = ai.defineFlow(
  {
    name: 'kaggleImportFlow',
    inputSchema: z.void(),
    outputSchema: KaggleSyncOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    if (!output) {
      throw new Error('Failed to generate Kaggle dataset batch');
    }
    return output;
  }
);
