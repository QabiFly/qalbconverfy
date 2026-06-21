"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavItems } from "@/constants/nav-items";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur-sm lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const isCreate = item.label === "Create";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium",
              isActive ? "text-accent" : "text-text-tertiary"
            )}
          >
            <item.icon className={cn("h-6 w-6", isCreate && "rounded-md bg-accent p-0.5 text-accent-foreground")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}