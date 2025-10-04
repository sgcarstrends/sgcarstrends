import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Resend } from "resend";

const app = new OpenAPIHono();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Request schema
const subscribeRequestSchema = z.object({
  email: z.string().email("Invalid email address").openapi({
    example: "user@example.com",
    description: "Email address to subscribe to the newsletter",
  }),
});

// Response schemas
const subscribeSuccessSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z
    .string()
    .openapi({ example: "Successfully subscribed to newsletter" }),
});

const subscribeErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  error: z.string().openapi({ example: "Invalid email address" }),
});

app.openapi(
  createRoute({
    method: "post",
    path: "/subscribe",
    summary: "Subscribe to newsletter",
    description: "Subscribe an email address to the SG Cars Trends newsletter",
    tags: ["Newsletter"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: subscribeRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Successfully subscribed to newsletter",
        content: {
          "application/json": {
            schema: subscribeSuccessSchema,
          },
        },
      },
      400: {
        description: "Invalid email address",
        content: {
          "application/json": {
            schema: subscribeErrorSchema,
          },
        },
      },
      409: {
        description: "Email already subscribed",
        content: {
          "application/json": {
            schema: subscribeErrorSchema,
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: subscribeErrorSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const { email } = c.req.valid("json");

      // Add contact to Resend audience
      // Note: You need to create an audience in Resend dashboard first
      // and get the audience ID
      const audienceId = process.env.RESEND_AUDIENCE_ID;

      if (!audienceId) {
        console.error("RESEND_AUDIENCE_ID not configured");
        return c.json(
          {
            success: false,
            error: "Newsletter service not configured",
          },
          500,
        );
      }

      const response = await resend.contacts.create({
        email,
        audienceId,
      });

      if (response.error) {
        // Check if contact already exists
        if (response.error.message?.includes("already exists")) {
          return c.json(
            {
              success: false,
              error: "Email already subscribed",
            },
            409,
          );
        }

        console.error("Resend error:", response.error);
        return c.json(
          {
            success: false,
            error: "Failed to subscribe to newsletter",
          },
          500,
        );
      }

      return c.json(
        {
          success: true,
          message: "Successfully subscribed to newsletter",
        },
        201,
      );
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return c.json(
        {
          success: false,
          error: "Failed to subscribe to newsletter",
        },
        500,
      );
    }
  },
);

export default app;
