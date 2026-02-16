import { randomBytes } from "node:crypto";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

export function register() {
  const langfuseSpanProcessor = new LangfuseSpanProcessor({
    shouldExportSpan: ({ otelSpan }) =>
      ["langfuse-sdk", "ai"].includes(otelSpan.instrumentationScope.name),
    // Export spans immediately in serverless environments (no batching)
    exportMode: "immediate",
  });

  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [langfuseSpanProcessor],
    // Use crypto-based ID generator to avoid Math.random() which triggers
    // Next.js prerender bailout in Server Components.
    idGenerator: {
      generateTraceId: () => randomBytes(16).toString("hex"),
      generateSpanId: () => randomBytes(8).toString("hex"),
    },
  });

  tracerProvider.register();
}
