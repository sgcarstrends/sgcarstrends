"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { type IconType, SiLinkedin, SiX } from "@icons-pack/react-simple-icons";
import {
  copyToClipboard,
  getShareUrl,
  type SharePlatform,
  triggerWebShare,
} from "@web/utils/social/share";
import { Check, Link2, Share2 } from "lucide-react";
import { useCallback, useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

interface ShareButtonConfig {
  platform: SharePlatform;
  label: string;
  icon: IconType;
}

const SHARE_PLATFORMS: ShareButtonConfig[] = [
  { platform: "twitter", label: "Share on X", icon: SiX },
  { platform: "linkedin", label: "Share on LinkedIn", icon: SiLinkedin },
];

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    await triggerWebShare(url, title);
  }, [url, title]);

  const buttonClassName = cn("text-default-500 hover:text-primary", className);

  return (
    <>
      {/* Mobile */}
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className={cn(buttonClassName, "flex rounded-full md:hidden")}
        onPress={handleNativeShare}
        aria-label="Share"
      >
        <Share2 className="size-4" aria-hidden="true" />
      </Button>

      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        {SHARE_PLATFORMS.map(({ platform, label, icon: Icon }) => (
          <Tooltip key={platform} content={label}>
            <Button
              as="a"
              href={getShareUrl({ platform, url, title })}
              target="_blank"
              rel="noopener noreferrer"
              isIconOnly
              variant="light"
              size="sm"
              className={cn(buttonClassName, "rounded-full")}
              aria-label={label}
            >
              <Icon
                className="size-4"
                color="currentColor"
                aria-hidden="true"
              />
            </Button>
          </Tooltip>
        ))}
        <Tooltip content={copied ? "Copied!" : "Copy link"}>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className={cn(buttonClassName, "rounded-full")}
            onPress={handleCopyLink}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="size-4 text-success" aria-hidden="true" />
            ) : (
              <Link2 className="size-4" aria-hidden="true" />
            )}
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
