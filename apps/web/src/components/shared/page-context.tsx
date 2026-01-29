"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

interface PageContextProps {
  title: string;
  content: string;
}

/**
 * Custom hook for streaming text effect (triggers on each expand)
 */
function useStreamingText(content: string, trigger: number) {
  const [streamedContent, setStreamedContent] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger is needed to re-run animation on expand/collapse
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset and start streaming
    setStreamedContent("");
    let index = 0;
    intervalRef.current = setInterval(() => {
      index += 2;
      setStreamedContent(content.slice(0, index));
      if (index >= content.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 25);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [content, trigger]);

  return streamedContent;
}

/**
 * Expandable context infobox for dashboard pages using HeroUI Accordion
 */
export function PageContext({ title, content }: PageContextProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(["context"]),
  );
  const [streamTrigger, setStreamTrigger] = useState(1);
  const streamedContent = useStreamingText(content, streamTrigger);

  const handleSelectionChange = (keys: "all" | Set<React.Key>) => {
    const newKeys = keys === "all" ? new Set(["context"]) : new Set<string>();
    if (keys !== "all") {
      for (const key of keys) {
        newKeys.add(String(key));
      }
    }
    const wasCollapsed = !selectedKeys.has("context");
    const willExpand = newKeys.has("context");

    setSelectedKeys(newKeys);

    if (wasCollapsed && willExpand) {
      setStreamTrigger((prev) => prev + 1);
    }
  };

  return (
    <Accordion
      variant="shadow"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      className="rounded-2xl bg-default-100 px-0"
      itemClasses={{
        base: "py-0",
        title: "font-medium text-foreground",
        trigger: "py-4 data-[hover=true]:bg-default-200 rounded-xl px-4",
        content: "px-4 pb-4",
      }}
    >
      <AccordionItem key="context" aria-label={title} title={title}>
        <div className="prose prose-sm max-w-none text-foreground">
          <Streamdown>{streamedContent}</Streamdown>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
