"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { navLinks } from "@web/config/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const ConnectSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      <div
        className={cn(
          "flex flex-col items-center gap-12 text-center transition-all duration-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex max-w-xl flex-col gap-4">
          <span className="font-medium text-primary text-sm uppercase tracking-widest">
            Stay Connected
          </span>
          <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
            Join our growing community
          </h2>
          <p className="text-default-600 text-lg leading-relaxed">
            Follow us on social media for the latest updates, insights, and
            discussions about Singapore&apos;s car market.
          </p>
        </div>

        {/* Social links */}
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-3 transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{ transitionDelay: "100ms" }}
        >
          {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
            <Button
              key={title}
              as="a"
              href={url}
              rel="me noreferrer"
              target="_blank"
              variant="bordered"
              className="gap-2 rounded-full border-default-300 px-5 transition-all hover:border-primary hover:bg-primary/5"
              aria-label={title}
            >
              <Icon className="size-4" />
              <span>{title}</span>
            </Button>
          ))}
        </div>

        {/* CTA */}
        <div
          className={cn(
            "flex flex-col items-center gap-4 border-default-200 border-t pt-12 transition-all duration-700 sm:flex-row sm:gap-6",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
            className="gap-2 rounded-full px-8"
          >
            Explore the Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            as={Link}
            href="/blog"
            variant="light"
            size="lg"
            className="gap-2 rounded-full px-8"
          >
            Read Market Insights
          </Button>
        </div>
      </div>
    </section>
  );
};
