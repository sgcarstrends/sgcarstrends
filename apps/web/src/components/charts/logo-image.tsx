import { Avatar } from "@heroui/avatar";
import Image from "next/image";

interface LogoImageProps {
  brand: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: {
    container: "h-12",
    avatar: "size-12",
    text: "text-sm",
  },
  md: {
    container: "h-16",
    avatar: "size-16",
    text: "text-lg",
  },
  lg: {
    container: "h-24",
    avatar: "size-24",
    text: "text-2xl",
  },
};

/**
 * Brand logo component with Avatar fallback
 *
 * Displays a logo image when available, otherwise shows an Avatar with
 * the brand's initials. Consistent sizing and styling across the app.
 *
 * @example
 * ```tsx
 * <LogoImage
 *   brand="Toyota"
 *   logoUrl="https://example.com/toyota-logo.png"
 *   size="lg"
 * />
 * ```
 */
export const LogoImage = ({
  brand,
  logoUrl,
  size = "lg",
  className = "",
}: LogoImageProps) => {
  const sizes = sizeMap[size];

  if (logoUrl) {
    return (
      <Image
        alt={`${brand} Logo`}
        src={logoUrl}
        width={512}
        height={512}
        className={`${sizes.container} object-contain ${className}`.trim()}
      />
    );
  }

  return (
    <div className={`flex justify-center ${className}`.trim()}>
      <Avatar
        name={brand}
        className={`${sizes.avatar} bg-primary object-contain ${sizes.text} text-primary-foreground`}
      />
    </div>
  );
};
