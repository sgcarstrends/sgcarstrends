import { bench, describe } from "vitest";
import { capitaliseWords } from "./capitalise-words";

describe("capitaliseWords", () => {
  bench("capitalise short string", () => {
    capitaliseWords("hello world");
  });

  bench("capitalise medium string", () => {
    capitaliseWords("the quick brown fox jumps over the lazy dog");
  });

  bench("capitalise long string", () => {
    capitaliseWords(
      "certificate of entitlement bidding results for passenger cars and light goods vehicles",
    );
  });

  bench("capitalise with underscores", () => {
    capitaliseWords("fuel_type vehicle_type registration_count");
  });

  bench("capitalise mixed case", () => {
    capitaliseWords("BMW Mercedes-Benz TOYOTA honda VOLKSWAGEN audi");
  });
});
