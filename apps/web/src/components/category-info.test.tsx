import { render, screen } from "@testing-library/react";
import { Car } from "lucide-react";
import { CategoryInfo } from "./category-info";

const mockCategories = {
  "Category A": true,
  "Category B": false,
};

vi.mock("@/app/store", () => ({
  default: vi.fn((selector) => {
    const state = {
      categories: mockCategories,
      updateCategories: vi.fn(),
    };
    return selector(state);
  }),
}));

describe("CategoryInfo", () => {
  it("should render with required props", () => {
    render(
      <CategoryInfo
        icon={Car}
        category="Category A"
        description="Cars up to 1600cc and 97kW"
      />,
    );

    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Cars up to 1600cc and 97kW")).toBeInTheDocument();
  });

  it("should render with canFilter prop", () => {
    render(
      <CategoryInfo
        icon={Car}
        category="Category A"
        description="Test description"
        canFilter={false}
      />,
    );

    expect(screen.getByText("Category A")).toBeInTheDocument();
  });
});
