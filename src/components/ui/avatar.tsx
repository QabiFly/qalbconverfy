import Image from "next/image";
import { cn } from "@/lib/cn";
import { BadgeCheck } from "lucide-react";
import { VerificationLevel } from "@/types";

const sizeMap = {
  xs: { box: "h-6 w-6", text: "text-[10px]", badge: "h-3 w-3" },
  sm: { box: "h-8 w-8", text: "text-xs", badge: "h-3.5 w-3.5" },
  md: { box: "h-10 w-10", text: "text-sm", badge: "h-4 w-4" },
  lg: { box: "h-16 w-16", text: "text-lg", badge: "h-5 w-5" },
  xl: { box: "h-24 w-24", text: "text-2xl", badge: "h-6 w-6" },
} as const;

export function Avatar({
  src,
  username,
  size = "md",
  verificationLevel,
  className,
}: {
  src?: string | null;
  username: string;
  size?: keyof typeof sizeMap;
  verificationLevel?: VerificationLevel;
  className?: string;
}) {
  const { box, text, badge } = sizeMap[size];
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className={cn("relative flex-shrink-0", box, className)}>
      {src ? (
        <Image src={src} alt={username} fill className="rounded-full object-cover ring-1 ring-border" sizes="96px" />
      ) : (
        <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-surface-raised font-semibold text-text-secondary ring-1 ring-border", text)}>
          {initial}
        </div>
      )}
      {verificationLevel && verificationLevel !== "none" && (
        <BadgeCheck className={cn("absolute -bottom-0.5 -right-0.5 rounded-full bg-background text-accent", badge)} />
      )}
    </div>
  );
}