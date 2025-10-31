"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import Typography from "@web/components/typography";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

interface FAQSectionsProps {
  sections: FAQSection[];
}

export const FAQSections = ({ sections }: FAQSectionsProps) => (
  <div className="flex flex-col gap-4">
    {sections.map(({ items, title }) => (
      <div key={title}>
        <Typography.H3>{title}</Typography.H3>
        <Accordion>
          {items.map(({ answer, question }) => (
            <AccordionItem key={question} title={question}>
              <Typography.Body>{answer}</Typography.Body>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    ))}
    <div>
      <Typography.H3>Still Have Questions?</Typography.H3>
      <Typography.P>
        If you have additional questions about Singapore&apos;s automotive
        market or need help understanding specific data points, feel free to
        explore our comprehensive car registration and COE data through the
        navigation menu above.
      </Typography.P>
    </div>
  </div>
);
