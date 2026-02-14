"use client";

// TODO: Migrate to HeroUI v3 Accordion when available
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Info } from "lucide-react";
import { Streamdown } from "streamdown";

interface AboutParfProps {
  title: string;
  content: string;
}

export function AboutParf({ title, content }: AboutParfProps) {
  return (
    <Accordion
      variant="shadow"
      className="rounded-2xl bg-default-100 px-0"
      itemClasses={{
        base: "py-0",
        title: "font-medium text-foreground",
        trigger: "py-4 data-[hover=true]:bg-default-200 rounded-xl px-4",
        content: "px-4 pb-4",
      }}
    >
      <AccordionItem
        key="context"
        aria-label={title}
        title={title}
        startContent={<Info className="size-4 text-primary" />}
      >
        <div className="prose prose-sm max-w-none text-foreground">
          <Streamdown>{content}</Streamdown>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
