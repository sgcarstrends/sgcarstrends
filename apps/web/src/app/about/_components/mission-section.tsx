"use client";

import { cn } from "@heroui/theme";
import { useEffect, useRef, useState } from "react";

export const MissionSection = () => {
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
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left column - Pull quote */}
        <div className="lg:col-span-5">
          <div
            className={cn(
              "sticky top-24 transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <blockquote className="relative">
              <div className="-left-4 lg:-left-8 absolute top-0 font-serif text-8xl text-primary/20">
                &ldquo;
              </div>
              <p className="relative font-medium text-2xl text-foreground leading-relaxed lg:text-3xl">
                Car buying in Singapore shouldn&apos;t feel like navigating a
                maze blindfolded.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Right column - Mission text */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <div
            className={cn(
              "flex flex-col gap-6 transition-all duration-700",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl">
              Our Mission
            </h2>
            <div className="flex flex-col gap-4 text-default-600 text-lg leading-relaxed">
              <p>
                Singapore&apos;s car market is uniquely complex. Between COE
                premiums that swing wildly, registration quotas that change
                monthly, and a maze of vehicle categories, making informed
                decisions feels nearly impossible.
              </p>
              <p>
                We built SG Cars Trends to change that. By aggregating official
                data from the Land Transport Authority and presenting it through
                intuitive visualisations, we&apos;re democratising access to
                market intelligence that was previously scattered across
                government portals and industry reports.
              </p>
              <p>
                Whether you&apos;re a first-time buyer trying to time your
                purchase, a dealer analysing market trends, or simply curious
                about Singapore&apos;s automotive landscape—we&apos;ve got you
                covered.
              </p>
            </div>
          </div>

          {/* Key points */}
          <div
            className={cn(
              "grid gap-6 border-default-200 border-t pt-8 transition-all duration-700 sm:grid-cols-2",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-foreground">
                Data-Driven Decisions
              </div>
              <p className="text-default-600 text-sm leading-relaxed">
                Move beyond gut feelings with historical trends and real-time
                insights.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-foreground">
                Always Up-to-Date
              </div>
              <p className="text-default-600 text-sm leading-relaxed">
                Fresh data after every COE bidding round and monthly
                registration release.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
