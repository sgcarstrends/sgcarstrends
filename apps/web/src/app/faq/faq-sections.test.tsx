import { render, screen } from "@testing-library/react";
import { FAQSections } from "./faq-sections";

describe("FAQSections", () => {
  const mockSections = [
    {
      title: "COE Basics",
      items: [
        {
          question: "What is COE?",
          answer: "Certificate of Entitlement is required to own a vehicle in Singapore.",
        },
        {
          question: "How long is COE valid?",
          answer: "COE is valid for 10 years from the date of registration.",
        },
      ],
    },
    {
      title: "Bidding Process",
      items: [
        {
          question: "How often are COE biddings held?",
          answer: "COE biddings are held twice a month.",
        },
      ],
    },
  ];

  it("should render all section titles", () => {
    render(<FAQSections sections={mockSections} />);

    expect(screen.getByText("COE Basics")).toBeInTheDocument();
    expect(screen.getByText("Bidding Process")).toBeInTheDocument();
  });

  it("should render all FAQ questions", () => {
    render(<FAQSections sections={mockSections} />);

    expect(screen.getByText("What is COE?")).toBeInTheDocument();
    expect(screen.getByText("How long is COE valid?")).toBeInTheDocument();
    expect(screen.getByText("How often are COE biddings held?")).toBeInTheDocument();
  });

  it("should render the help section", () => {
    render(<FAQSections sections={mockSections} />);

    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
    expect(
      screen.getByText(/If you have additional questions about Singapore's automotive market/)
    ).toBeInTheDocument();
  });

  it("should render with empty sections", () => {
    render(<FAQSections sections={[]} />);
    
    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
  });

  it("should handle sections with no items", () => {
    const sectionsWithEmptyItems = [
      {
        title: "Empty Section",
        items: [],
      },
    ];

    render(<FAQSections sections={sectionsWithEmptyItems} />);

    expect(screen.getByText("Empty Section")).toBeInTheDocument();
    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
  });
});