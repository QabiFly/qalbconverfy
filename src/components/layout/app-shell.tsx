import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { RightSidebar } from "@/components/layout/right-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
      <RightSidebar />
      <BottomNav />
    </div>
  );
}