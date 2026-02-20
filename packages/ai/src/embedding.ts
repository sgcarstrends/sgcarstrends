import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generatePostEmbedding(post: {
  title: string;
  excerpt?: string | null;
  content: string;
}): Promise<number[]> {
  const parts: string[] = [post.title];

  if (post.excerpt) {
    parts.push(post.excerpt);
  }

  parts.push(post.content.slice(0, 2000));

  const { embedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    value: parts.join("\n\n"),
    providerOptions: {
      google: { outputDimensionality: 768 },
    },
  });

  return embedding;
}
