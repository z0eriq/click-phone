import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Height in pixels for the logo image */
  height?: number;
  priority?: boolean;
}

/** Full CLICK PHONE brand mark (icon + bilingual wordmark). */
export function BrandLogo({ className, height = 40, priority = false }: BrandLogoProps) {
  const width = Math.round(height * 2.4);

  return (
    <Image
      src="/logo.png"
      alt="CLICK PHONE | كليك فون"
      width={width}
      height={height}
      priority={priority}
      className={cn("rounded-lg object-contain", className)}
      style={{ height, width: "auto" }}
    />
  );
}
