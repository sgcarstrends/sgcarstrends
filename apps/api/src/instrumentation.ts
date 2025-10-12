import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

export let langfuseSpanProcessor: LangfuseSpanProcessor | null = null;
let tracerProvider: NodeTracerProvider | null = null;

export const startTracing = (): void => {
  if (tracerProvider) {
    return;
  }

  const environment = process.env.VERCEL_ENV ?? process.env.STAGE;

  langfuseSpanProcessor = new LangfuseSpanProcessor({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_HOST,
    environment,
  });

  tracerProvider = new NodeTracerProvider({
    spanProcessors: [langfuseSpanProcessor],
  });

  tracerProvider.register();
};

export const shutdownTracing = async (): Promise<void> => {
  if (langfuseSpanProcessor) {
    await langfuseSpanProcessor.forceFlush();
  }

  if (tracerProvider) {
    await tracerProvider.shutdown();
    tracerProvider = null;
    langfuseSpanProcessor = null;
  }
};
