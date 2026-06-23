"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validation/auth-schemas";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useRedirectIfAuthenticated } from "@/hooks/use-require-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/app-routes";
import { extractFieldErrors } from "@/lib/api/client";

export default function LoginPage() {
  const { isHydrating } = useRedirectIfAuthenticated();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm < LoginFormValues > ({ resolver: zodResolver(loginSchema) });
  
  const onSubmit = async (values: LoginFormValues) => {
  setIsSubmitting(true);
  try {
    await login(values);
  } catch (error) {
    const fieldErrors = extractFieldErrors(error);
    if (fieldErrors) {
      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field === "identifier" || field === "password") {
          setError(field, { message });
        }
      }
    }
  } finally {
    setIsSubmitting(false);
  }
};
  
  if (isHydrating) return null;
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <Link href={APP_ROUTES.landing} className="mb-6 block text-center text-lg font-bold text-text-primary">
          Qalb<span className="text-accent">Converfy</span>
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-text-primary">Welcome back</h1>
        <p className="mb-6 text-sm text-text-secondary">Sign in to continue.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email, username, or phone"
            placeholder="you@example.com"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register("identifier")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href={APP_ROUTES.register} className="font-medium text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
