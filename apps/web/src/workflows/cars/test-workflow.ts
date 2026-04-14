/**
 * Minimal workflow for integration testing the WDK runtime.
 * Tests the workflow lifecycle (start, step execution, return value)
 * without requiring database or external service connections.
 */
export async function testCalculateWorkflow(input: {
  a: number;
  b: number;
}) {
  "use workflow";

  const sum = await addNumbers(input.a, input.b);
  const doubled = await doubleNumber(sum);

  return { sum, doubled };
}

async function addNumbers(a: number, b: number): Promise<number> {
  "use step";
  return a + b;
}

async function doubleNumber(n: number): Promise<number> {
  "use step";
  return n * 2;
}
