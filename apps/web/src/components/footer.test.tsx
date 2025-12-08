import { render } from "@testing-library/react";
import { Footer } from "@web/components/footer";

describe("Footer", () => {
  it("should render asynchronous footer content with version information", async () => {
    const footer = await Footer();
    const { getByText } = render(footer);
    expect(getByText(/All rights reserved/)).toBeInTheDocument();
    expect(getByText(/Privacy Policy/)).toBeInTheDocument();
  });
});
