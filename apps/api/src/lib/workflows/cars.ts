import { SITE_URL } from "@api/config";
import { platforms } from "@api/config/platforms";
import { options } from "@api/lib/workflows/options";
import {
  getCarRegistrationsByMonth,
  getCarsByMonth,
  getCarsLatestMonth,
} from "@api/lib/workflows/queries/cars";
import { savePost } from "@api/lib/workflows/save-post";
import { updateCars } from "@api/lib/workflows/updateCars";
import {
  processTask,
  publishToPlatform,
  type Task,
} from "@api/lib/workflows/workflow";
import {
  createPartFromText,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import slugify from "@sindresorhus/slugify";
import { createWorkflow } from "@upstash/workflow/hono";

export const carsWorkflow = createWorkflow(
  async (context) => {
    const carTasks: Task[] = [{ name: "cars", handler: updateCars }];

    const carResults = await Promise.all(
      carTasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    const processedCarResults = carResults.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedCarResults.length === 0) {
      return {
        message:
          "No car records processed. Skipped publishing to social media.",
      };
    }

    // Get latest updated month for cars from the database
    const { month } = await getCarsLatestMonth();

    const result = await getCarRegistrationsByMonth(month);

    const message = [
      `🚗 Updated car registration data for ${result.month}!`,
      `\n📊 Total registrations: ${result.total.toLocaleString()}`,
      "\n⚡ By Fuel Type:",
      ...Object.entries(result.fuelType).map(
        ([type, count]) => `${type}: ${count.toLocaleString()}`,
      ),
      "\n🚙 By Vehicle Type:",
      ...Object.entries(result.vehicleType).map(
        ([type, count]) => `${type}: ${count.toLocaleString()}`,
      ),
    ].join("\n");

    const link = `${SITE_URL}/cars?month=${month}`;

    // Generate blog post after successful data update
    const blog = await context.run("Generate blog post", async () => {
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
          
          Guidelines:
          - Write a compelling title that includes the month/year
          - Start with an executive summary of key trends
          - Include specific data points and percentages where relevant
          - Analyse fuel type trends (petrol, hybrid, electric)
          - Discuss popular vehicle types and makes
          - Provide market insights and implications
          - Keep the tone professional but accessible
          - Use proper markdown formatting with headers, bullet points, etc.
          - Aim for 300-500 words
          
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
      const savedPost = await savePost({
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
        postId: savedPost.id,
        title: savedPost.title,
      };
    });

    for (const _ of processedCarResults) {
      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, { message, link }),
        ),
      );
    }

    // Announce new blog post on social media
    if (blog?.success && blog?.title) {
      const blogLink = `${SITE_URL}/blog/${slugify(blog.title)}`;
      const blogMessage = [
        `📰 New Blog Post: ${blog.title}`,
        `\n📊 Read the full insights and data breakdown`,
      ].join("\n");

      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, {
            message: blogMessage,
            link: blogLink,
          }),
        ),
      );
    }

    return {
      message: "Car data processed and published successfully",
    };
  },
  { ...options },
);
