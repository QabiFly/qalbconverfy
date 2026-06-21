"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNavItems } from "@/constants/nav-items";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { useAuth } from "@/providers/auth-provider";
import { useUnreadNotificationCount, useUnreadMessageCount } from "@/hooks/use-unread-counts";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const { data: unreadNotifications } = useUnreadNotificationCount();
  const { data: unreadMessages } = useUnreadMessageCount();
  
  return (
    <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col border-r border-border px-3 py-5 lg:flex">
      <Link href="/home" className="mb-6 flex items-center gap-2 px-2">
        <span className="text-xl font-bold tracking-tight text-text-primary">
          Qalb<span className="text-accent">Converfy</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const unreadCount =
            item.showUnreadDot === "notifications"
              ? unreadNotifications
              : item.showUnreadDot === "messages"
                ? unreadMessages
                : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-surface-raised text-accent" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {Boolean(unreadCount) && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
                  {unreadCount && unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <button
          onClick={() => logout()}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-danger"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      )}

      {user && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
          <Avatar src={user.avatar_url} username={user.username} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">@{user.username}</p>
            <p className="truncate text-xs text-text-tertiary">
              {user.follower_count ?? 0} followers
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}