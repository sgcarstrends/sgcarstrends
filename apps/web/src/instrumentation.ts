import { LangfuseSpanProcessor, type ShouldExportSpan } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

/**
 * Filter to only export AI SDK spans.
 * Excludes Next.js infra spans and other generic HTTP/fetch spans.
 */
const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  ["langfuse-sdk", "ai"].includes(otelSpan.instrumentationScope.name);

const langfuseSpanProcessor = new LangfuseSpanProcessor({
  shouldExportSpan,
  // Export spans immediately in serverless environments (no batching)
  exportMode: "immediate",
});

const tracerProvider = new NodeTracerProvider({
  spanProcessors: [langfuseSpanProcessor],
});

tracerProvider.register();
