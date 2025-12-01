"use client";

import { cn } from "@sgcarstrends/ui/lib/utils";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from the article on mount
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements)
      .filter((el) => el.id) // Only include elements with IDs
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
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
        // Find the first heading that is intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Get the topmost visible heading
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

    // Observe all heading elements
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
    <nav className="mb-6 border border-default-200 bg-background p-6">
      <h3 className="mb-4 border-default-200 border-b pb-2 font-bold text-default-500 text-sm uppercase tracking-wider">
        In This Article
      </h3>
      <div className="flex flex-col gap-2">
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
              "group flex items-start gap-2 text-sm transition-colors",
              heading.level === 3 && "pl-4",
              activeId === heading.id
                ? "font-medium text-foreground"
                : "text-default-600 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "mt-0.5 text-xs transition-colors",
                activeId === heading.id
                  ? "text-primary"
                  : "text-default-400 group-hover:text-default-500",
              )}
            >
              {idx + 1}.
            </span>
            <span className="hover:underline">{heading.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
