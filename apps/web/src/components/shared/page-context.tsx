"use client";

import { cn } from "@heroui/theme";
import Typography from "@web/components/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronUp, HelpCircle } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Streamdown } from "streamdown";

interface PageContextProps {
  topic: string;
  title: string;
  content: string;
}

/**
 * Custom hook for streaming text effect with localStorage persistence
 */
function useStreamingText(topic: string, content: string) {
  const storageKey = `context-seen-${topic}`;
  const [streamedContent, setStreamedContent] = useState("");
  const [hasStreamed, setHasStreamed] = useState(false);
  const isStreamingRef = useRef(false);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (seen) {
      setHasStreamed(true);
      setStreamedContent(content);
    }
  }, [storageKey, content]);

  const startStreaming = useEffectEvent(() => {
    if (hasStreamed || isStreamingRef.current) return;

    isStreamingRef.current = true;
    let index = 0;
    const interval = setInterval(() => {
      index += 2;
      setStreamedContent(content.slice(0, index));
      if (index >= content.length) {
        clearInterval(interval);
        localStorage.setItem(storageKey, "true");
        setHasStreamed(true);
      }
    }, 25);
  });

  return { streamedContent, startStreaming };
}

/**
 * Expandable context infobox for dashboard pages
 */
export function PageContext({ topic, title, content }: PageContextProps) {
  const [expanded, setExpanded] = useState(false);
  const { streamedContent, startStreaming } = useStreamingText(topic, content);

  const handleToggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (willExpand) startStreaming();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-primary border-l-4 bg-default-100 p-4",
        "transition-shadow duration-200",
        expanded && "shadow-sm",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="size-5 shrink-0 text-primary" />
          <Typography.Label className="text-foreground">
            {title}
          </Typography.Label>
        </div>
        <span className="flex items-center gap-1 font-medium text-primary text-sm">
          {expanded ? "Show less" : "Learn more"}
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-default-200 border-t">
              <div className="prose prose-sm max-w-none text-foreground">
                <Streamdown>{streamedContent}</Streamdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
