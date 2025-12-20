import { addToast } from "@heroui/toast";

export type SharePlatform = "twitter" | "linkedin";

interface ShareUrlParams {
  platform: SharePlatform;
  url: string;
  title: string;
}

/**
 * Generate platform-specific share URLs
 */
export const getShareUrl = ({
  platform,
  url,
  title,
}: ShareUrlParams): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareUrls: Record<SharePlatform, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return shareUrls[platform];
};

/**
 * Copy URL to clipboard with toast feedback
 */
export const copyToClipboard = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    addToast({
      title: "Link copied to clipboard",
      variant: "bordered",
    });
    return true;
  } catch {
    addToast({
      title: "Failed to copy link",
      variant: "bordered",
    });
    return false;
  }
};

/**
 * Check if Web Share API is available
 */
export const canUseWebShare = (): boolean => {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
};

/**
 * Trigger native Web Share API
 */
export const triggerWebShare = async (
  url: string,
  title: string,
): Promise<boolean> => {
  if (!canUseWebShare()) {
    return false;
  }

  try {
    await navigator.share({ title, url });
    return true;
  } catch (error) {
    // User cancelled or share failed - AbortError is expected when user cancels
    if ((error as Error).name !== "AbortError") {
      console.error("Share failed:", error);
    }
    return false;
  }
};
