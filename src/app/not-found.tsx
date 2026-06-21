import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/app-routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised text-accent">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold text-text-primary">404</h1>
      <p className="max-w-sm text-text-secondary">
        This page doesn&apos;t exist, or it may have moved. Let&apos;s get you back on track.
      </p>
      <Link href={APP_ROUTES.landing}>
        <Button>Go home</Button>
      </Link>
    </div>
  );
}