import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("workflow", () => ({
  getStepMetadata: vi.fn(() => ({ attempt: 1 })),
  FatalError: class FatalError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "FatalError";
    }
  },
  RetryableError: class RetryableError extends Error {
    retryAfter?: number | string;
    constructor(
      message: string,
      public options?: { retryAfter?: number | string },
    ) {
      super(message);
      this.name = "RetryableError";
      this.retryAfter = options?.retryAfter;
    }
  },
}));

import { FatalError, getStepMetadata, RetryableError } from "workflow";
import { handleStepError } from "./error-handling";

describe("error-handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStepMetadata).mockReturnValue({ attempt: 1 });
  });

  describe("handleStepError", () => {
    describe("network errors", () => {
      it("should throw RetryableError for ECONNREFUSED", () => {
        expect(() =>
          handleStepError(new Error("ECONNREFUSED"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for ECONNRESET", () => {
        expect(() =>
          handleStepError(new Error("ECONNRESET"), { category: "database" }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for fetch failed", () => {
        expect(() =>
          handleStepError(new Error("fetch failed"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for network errors", () => {
        expect(() =>
          handleStepError(new Error("network error occurred"), {
            category: "database",
          }),
        ).toThrow(RetryableError);
      });

      it("should include context prefix in error message", () => {
        try {
          handleStepError(new Error("ETIMEDOUT"), {
            category: "lta-datamall",
            context: "cars",
          });
        } catch (error) {
          expect((error as Error).message).toContain("[cars]");
        }
      });
    });

    describe("lta-datamall category", () => {
      it("should throw RetryableError for 500 server error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 500 Internal Server Error"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for 503 server error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 503 Service Unavailable"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for rate limiting (429)", () => {
        expect(() =>
          handleStepError(new Error("HTTP 429 Too Many Requests"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for rate limit message", () => {
        expect(() =>
          handleStepError(new Error("Rate limit exceeded"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for timeout", () => {
        expect(() =>
          handleStepError(new Error("Request timeout"), {
            category: "lta-datamall",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw FatalError for 401 auth error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 401 Unauthorized"), {
            category: "lta-datamall",
          }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for 403 auth error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 403 Forbidden"), {
            category: "lta-datamall",
          }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for unknown errors", () => {
        expect(() =>
          handleStepError(new Error("Unknown error"), {
            category: "lta-datamall",
          }),
        ).toThrow(FatalError);
      });
    });

    describe("ai-generation category", () => {
      it("should throw RetryableError for rate limiting", () => {
        expect(() =>
          handleStepError(new Error("HTTP 429"), { category: "ai-generation" }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for server overload", () => {
        expect(() =>
          handleStepError(new Error("Server overloaded"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for 500 server error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 500 error"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for model capacity errors", () => {
        expect(() =>
          handleStepError(new Error("Model capacity exceeded"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for model errors", () => {
        expect(() =>
          handleStepError(new Error("Model not available"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw FatalError for invalid input", () => {
        expect(() =>
          handleStepError(new Error("Invalid input provided"), {
            category: "ai-generation",
          }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for 401 auth error", () => {
        expect(() =>
          handleStepError(new Error("HTTP 401"), { category: "ai-generation" }),
        ).toThrow(FatalError);
      });

      it("should throw RetryableError for other AI errors", () => {
        expect(() =>
          handleStepError(new Error("Some AI error"), {
            category: "ai-generation",
          }),
        ).toThrow(RetryableError);
      });
    });

    describe("database category", () => {
      it("should throw RetryableError for pool exhaustion", () => {
        expect(() =>
          handleStepError(new Error("Connection pool exhausted"), {
            category: "database",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for connection errors", () => {
        expect(() =>
          handleStepError(new Error("Connection refused"), {
            category: "database",
          }),
        ).toThrow(RetryableError);
      });

      it("should throw RetryableError for timeout", () => {
        expect(() =>
          handleStepError(new Error("Query timeout"), { category: "database" }),
        ).toThrow(RetryableError);
      });

      it("should throw FatalError for constraint violations", () => {
        expect(() =>
          handleStepError(new Error("Constraint violation"), {
            category: "database",
          }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for duplicate key errors", () => {
        expect(() =>
          handleStepError(new Error("Duplicate key"), { category: "database" }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for unique constraint errors", () => {
        expect(() =>
          handleStepError(new Error("Unique constraint failed"), {
            category: "database",
          }),
        ).toThrow(FatalError);
      });

      it("should throw FatalError for unknown database errors", () => {
        expect(() =>
          handleStepError(new Error("Unknown database error"), {
            category: "database",
          }),
        ).toThrow(FatalError);
      });
    });

    describe("retry backoff", () => {
      it("should use exponential backoff based on attempt number", () => {
        vi.mocked(getStepMetadata).mockReturnValue({ attempt: 3 });

        try {
          handleStepError(new Error("ECONNREFUSED"), {
            category: "lta-datamall",
          });
        } catch (error) {
          expect((error as RetryableError).options?.retryAfter).toBe(9000); // 3^2 * 1000
        }
      });
    });

    describe("non-Error values", () => {
      it("should handle string errors", () => {
        expect(() =>
          handleStepError("String error", { category: "database" }),
        ).toThrow(FatalError);
      });
    });
  });
});
