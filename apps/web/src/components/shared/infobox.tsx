"use client";

import { Alert } from "@heroui/alert";
import { Streamdown } from "streamdown";

interface InfoboxProps {
  title: string;
  content: string;
}

export function Infobox({ title, content }: InfoboxProps) {
  return (
    <Alert
      color="primary"
      variant="bordered"
      className="px-4 py-3"
      title={title}
      description={
        <div className="prose prose-sm prose-p:my-0 max-w-none text-foreground">
          <Streamdown>{content}</Streamdown>
        </div>
      }
    />
  );
}
