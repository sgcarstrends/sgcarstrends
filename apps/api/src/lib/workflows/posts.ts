import { getCarsByMonth } from "@api/lib/workflows/queries/cars";
import { getCoeForMonth } from "@api/lib/workflows/queries/coe";
import { savePost } from "@api/lib/workflows/save-post";
import {
  createPartFromText,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import type { WorkflowContext } from "@upstash/workflow";

export const generateCarPost = (context: WorkflowContext, month: string) => {
  return context.run("Generate post", async () => {
    // Get car data from database
    const cars = await getCarsByMonth(month);

    const data = cars.map((row) => JSON.stringify(row));

    console.log("Blog post generation started...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const config = {
      thinkingConfig: {
        thinkingBudget: 8192,
      },
      responseMimeType: "text/plain",
    };
    const model = "gemini-2.5-pro";
    const cache = await ai.caches.create({
      model,
      config: {
        contents: createUserContent(
          createPartFromText(
            `Car registration data for ${month}: ${data.join("\n")}`,
          ),
        ),
        systemInstruction: `You are a data analyst specialising in Singapore's car market.
          Analyse the provided car registration data and write a blog post in markdown format.

          Data Structure:
          Each record contains:
          - month: Month/year of registration data (text)
          - make: Car manufacturer/brand (text)
          - fuel_type: Type of fuel (text)
          - vehicle_type: Type of vehicle (text)
          - number: Number of vehicle registrations (integer)
          
          Guidelines:
          - Write a compelling, concise title (maximum 5-6 words)
          - Start with an executive summary of key trends
          - Include these 2 tables in markdown format:
            1. Fuel Type Breakdown Table: Group and sum registrations by fuel_type
            2. Vehicle Type Breakdown Table: Group and sum registrations by vehicle_type
          - Include specific data points and percentages where relevant
          - Analyse fuel type trends (petrol, hybrid, electric)
          - Discuss popular vehicle types and makes
          - Provide market insights and implications
          - Keep the tone professional but accessible
          - Use proper markdown formatting with headers, bullet points, tables
          - Aim for 400-600 words
          
          Output only the post content in markdown format, starting with the title as # header.`,
      },
    });

    const response = await ai.models.generateContent({
      model,
      contents:
        "Generate a comprehensive blog post analysing the car registration trends for this month.",
      config: {
        ...config,
        cachedContent: cache.name,
      },
    });

    const blogContent = response.text;
    console.log("Blog post generated, saving to database...");

    // Extract title from the first line (assuming it starts with # Title)
    const lines = blogContent.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Save to database
    const post = await savePost({
      title,
      content: blogContent,
      metadata: {
        month,
        dataType: "cars",
        modelVersion: response.modelVersion,
        responseId: response.responseId,
        createTime: response.createTime,
        usageMetadata: response.usageMetadata,
      },
    });

    console.log("Blog post generation completed");

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  });
};

export const generateCoePost = (context: WorkflowContext, month: string) => {
  return context.run("Generate COE post", async () => {
    // Get COE data from database for both bidding exercises
    const coe = await getCoeForMonth(month);

    const data = coe.map((row) => JSON.stringify(row));

    console.log("COE blog post generation started...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const config = {
      thinkingConfig: {
        thinkingBudget: 8192,
      },
      responseMimeType: "text/plain",
    };
    const model = "gemini-2.5-pro";
    const cache = await ai.caches.create({
      model,
      config: {
        contents: createUserContent(
          createPartFromText(
            `COE bidding data for ${month}: ${data.join("\n")}`,
          ),
        ),
        systemInstruction: `You are a data analyst specialising in Singapore's Certificate of Entitlement (COE).
          Analyse the provided COE bidding data and write a blog post in markdown format.

          Data Structure:
          Each record contains:
          - month: Month/year of COE bidding (text)
          - bidding_no: 1 (first) or 2 (second) bidding exercise (integer)
          - vehicle_class: Category A (≤1600cc & ≤130bhp), B (>1600cc or >130bhp), C (goods vehicles & buses), D (motorcycles), E (open category) (text)
          - quota: Total certificates available (integer)
          - bids_received: Number of bids submitted (integer)
          - bids_success: Number of successful bids (integer)
          - premium: Final premium amount in SGD (integer)

          Guidelines:
          - Write a compelling, concise title (maximum 5-6 words) about COE bidding results
          - Start with an executive summary of key trends across both bidding exercises
          - Include these 2 tables in markdown format:
            1. First Bidding Exercise Table: Filter data where bidding_no = 1, show by vehicle_class
            2. Second Bidding Exercise Table: Filter data where bidding_no = 2, show by vehicle_class
          - Analyze bidding competition (over-subscription rates) for each category
          - Highlight significant premium changes and market movements
          - Discuss quota utilization and bidding success rates
          - Provide market insights on what the trends indicate for car buyers
          - Keep the tone professional but accessible to car buyers
          - Use proper markdown formatting with headers, bullet points, tables
          - Aim for 400-600 words

          Output only the post content in markdown format, starting with the title as # header.`,
      },
    });

    const response = await ai.models.generateContent({
      model,
      contents:
        "Generate a comprehensive blog post analysing the COE bidding results and trends for this month.",
      config: {
        ...config,
        cachedContent: cache.name,
      },
    });

    const blogContent = response.text;
    console.log("COE blog post generated, saving to database...");

    // Extract title from the first line (assuming it starts with # Title)
    const lines = blogContent.split("\n");
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, "");

    // Save to database
    const post = await savePost({
      title,
      content: blogContent,
      metadata: {
        month,
        dataType: "coe",
        modelVersion: response.modelVersion,
        responseId: response.responseId,
        createTime: response.createTime,
        usageMetadata: response.usageMetadata,
      },
    });

    console.log("COE blog post generation completed");

    return {
      success: true,
      month,
      postId: post.id,
      title: post.title,
      slug: post.slug,
    };
  });
};
