import { render, screen } from "@testing-library/react";
import { Progress } from "@web/components/progress";

describe("Progress", () => {
  it("should render Progress content", () => {
    render(<Progress value={0.5}>50%</Progress>);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
