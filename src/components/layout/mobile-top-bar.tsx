"use client";

import Link from "next/link";
import { Bell, MessageCircle } from "lucide-react";
import { useUnreadNotificationCount, useUnreadMessageCount } from "@/hooks/use-unread-counts";
import { APP_ROUTES } from "@/constants/app-routes";

export function MobileTopBar() {
  const { data: unreadNotifications } = useUnreadNotificationCount();
  const { data: unreadMessages } = useUnreadMessageCount();
  
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <Link href={APP_ROUTES.home} className="text-lg font-bold text-text-primary">
        Qalb<span className="text-accent">Converfy</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href={APP_ROUTES.messages} className="relative">
          <MessageCircle className="h-6 w-6 text-text-primary" />
          {Boolean(unreadMessages) && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
          )}
        </Link>
        <Link href={APP_ROUTES.notifications} className="relative">
          <Bell className="h-6 w-6 text-text-primary" />
          {Boolean(unreadNotifications) && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
          )}
        </Link>
      </div>
    </header>
  );
}