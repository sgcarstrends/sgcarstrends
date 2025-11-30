"use client";

import { cn } from "@sgcarstrends/ui/lib/utils";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const HorizontalTOC = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from the article on mount
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2");
    const items: TocItem[] = Array.from(elements)
      .filter((el) => el.id) // Only include elements with IDs
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: 2,
      }));

    setHeadings(items);

    // Set initial active heading
    if (items.length > 0) {
      setActiveId(items[0].id);
    }
  }, []);

  // Track scroll position and update active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top
              ? prev
              : current,
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      },
    );

    for (const { id } of headings) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="mb-8 border-default-200 border-b pb-6">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {headings.map((heading, idx) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                setActiveId(heading.id);
              }
            }}
            className={cn(
              "group flex items-center gap-2 text-sm transition-colors",
              activeId === heading.id
                ? "text-foreground"
                : "text-default-600 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "font-bold text-xs transition-opacity",
                activeId === heading.id
                  ? "text-primary"
                  : "text-primary/60 group-hover:text-primary",
              )}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{heading.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
