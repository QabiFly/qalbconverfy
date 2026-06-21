import {
  Home,
  Compass,
  Clapperboard,
  PlaySquare,
  CircleDot,
  MessageCircle,
  Bell,
  Search,
  User,
  Settings,
  PlusSquare,
} from "lucide-react";
import { APP_ROUTES } from "@/constants/app-routes";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType < { className ? : string } > ;
  showUnreadDot ? : "notifications" | "messages";
}

export const sidebarNavItems: NavItem[] = [
  { label: "Home", href: APP_ROUTES.home, icon: Home },
  { label: "Explore", href: APP_ROUTES.explore, icon: Compass },
  { label: "Reels", href: APP_ROUTES.reels, icon: Clapperboard },
  { label: "Watch", href: APP_ROUTES.watch, icon: PlaySquare },
  { label: "Stories", href: APP_ROUTES.stories, icon: CircleDot },
  { label: "Messages", href: APP_ROUTES.messages, icon: MessageCircle, showUnreadDot: "messages" },
  { label: "Notifications", href: APP_ROUTES.notifications, icon: Bell, showUnreadDot: "notifications" },
  { label: "Search", href: APP_ROUTES.search, icon: Search },
  { label: "Profile", href: APP_ROUTES.profile, icon: User },
  { label: "Settings", href: APP_ROUTES.settings, icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", href: APP_ROUTES.home, icon: Home },
  { label: "Explore", href: APP_ROUTES.explore, icon: Compass },
  { label: "Create", href: APP_ROUTES.createPost, icon: PlusSquare },
  { label: "Reels", href: APP_ROUTES.reels, icon: Clapperboard },
  { label: "Profile", href: APP_ROUTES.profile, icon: User },
];