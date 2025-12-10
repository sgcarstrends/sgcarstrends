"use client";

import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { Code2, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CreatorSection = () => {
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
    <section
      ref={sectionRef}
      className="-mx-6 relative overflow-hidden bg-foreground px-6 py-20 lg:py-28"
    >
      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="-right-1/4 absolute top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto">
        <div
          className={cn(
            "mx-auto flex max-w-2xl flex-col items-center gap-8 text-center transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          {/* Icon */}
          <Chip
            variant="light"
            startContent={<Code2 className="h-4 w-4" />}
            classNames={{
              base: "bg-transparent",
              content:
                "font-medium text-primary text-sm uppercase tracking-widest",
            }}
          >
            Behind the Data
          </Chip>

          {/* Main content */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-3xl text-primary-foreground tracking-tight lg:text-4xl">
              Built with{" "}
              <Heart className="mb-1 inline h-7 w-7 fill-red-500 text-red-500" />{" "}
              in Singapore
            </h2>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              SG Cars Trends is an independent project created by{" "}
              <Link
                href="https://ruchern.dev"
                isExternal
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Ru Chern
              </Link>
              , a software engineer passionate about making data accessible and
              meaningful.
            </p>
          </div>

          {/* Subtle note */}
          <p className="max-w-lg text-primary-foreground/50 text-sm leading-relaxed">
            This platform is maintained in spare time alongside a full-time job.
            If you find it useful, consider sharing it with others who might
            benefit.
          </p>
        </div>
      </div>
    </section>
  );
};
