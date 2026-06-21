"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validation/auth-schemas";
import { useAuth } from "@/providers/auth-provider";
import { useRedirectIfAuthenticated } from "@/hooks/use-require-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/app-routes";
import { extractFieldErrors } from "@/lib/api/client";

export default function RegisterPage() {
  const { isHydrating } = useRedirectIfAuthenticated();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm < RegisterFormValues > ({ resolver: zodResolver(registerSchema) });
  
  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(values);
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors) {
        for (const [field, message] of Object.entries(fieldErrors)) {
          if (field === "email" || field === "username" || field === "password" || field === "password_confirm") {
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <Link href={APP_ROUTES.landing} className="mb-6 block text-center text-lg font-bold text-text-primary">
          Qalb<span className="text-accent">Converfy</span>
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-text-primary">Create your account</h1>
        <p className="mb-6 text-sm text-text-secondary">Join QalbConverfy in seconds.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Username"
            placeholder="yourname"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password_confirm?.message}
            {...register("password_confirm")}
          />

          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href={APP_ROUTES.login} className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}