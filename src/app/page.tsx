"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/app-routes";
import { healthService } from "@/lib/api/services";

export default function LandingPage() {
  const [apiStatus, setApiStatus] = useState < "checking" | "online" | "offline" > ("checking");
  
  useEffect(() => {
    healthService
      .check()
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <span className="text-xl font-bold text-text-primary">
          Qalb<span className="text-accent">Converfy</span>
        </span>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span
            className={
              "h-2 w-2 rounded-full " +
              (apiStatus === "online"
                ? "bg-success"
                : apiStatus === "offline"
                  ? "bg-danger"
                  : "bg-warning animate-pulse")
            }
          />
          {apiStatus === "online" ? "API online" : apiStatus === "offline" ? "API offline" : "Checking API..."}
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-text-primary sm:text-6xl">
          Share moments. <span className="text-accent">Connect</span> deeply.
        </h1>
        <p className="max-w-xl text-base text-text-secondary sm:text-lg">
          QalbConverfy is where posts, reels, stories, and conversations come together —
          built for speed, privacy, and a premium feel.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={APP_ROUTES.register}>
            <Button size="lg" fullWidth>
              Create an account
            </Button>
          </Link>
          <Link href={APP_ROUTES.login}>
            <Button size="lg" variant="outline" fullWidth>
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-text-tertiary">
        QalbConverfy &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}