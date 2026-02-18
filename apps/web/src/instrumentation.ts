export async function register() {
  const { randomBytes } = await import("node:crypto");
  const { LangfuseSpanProcessor } = await import("@langfuse/otel");
  const { NodeTracerProvider } = await import("@opentelemetry/sdk-trace-node");

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
