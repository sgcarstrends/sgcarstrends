import { capitaliseWords } from "@web/utils/capitalise-words";

describe("capitaliseWords", () => {
  it("should return as it is when words are already capitalised", () => {
    expect(capitaliseWords("Hello World")).toBe("Hello World");
  });

  it("should return a capitalised format for all lowercase words", () => {
    expect(capitaliseWords("hello world")).toBe("Hello World");
  });

  it("should return a capitalised format for all uppercase words", () => {
    expect(capitaliseWords("HELLO WORLD")).toBe("Hello World");
  });

  it("should return a capitalised format for a single word", () => {
    expect(capitaliseWords("hello")).toBe("Hello");
    expect(capitaliseWords("HELLO")).toBe("Hello");
  });

  it("should return a capitalised format for a word with underscore", () => {
    expect(capitaliseWords("HELLO_WORLD")).toBe("Hello World");
    expect(capitaliseWords("hello_world")).toBe("Hello World");
  });
});
