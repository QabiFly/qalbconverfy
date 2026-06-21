import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email, username, or phone number."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormValues = z.infer < typeof loginSchema > ;

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must be at most 30 characters.")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    password_confirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match.",
    path: ["password_confirm"],
  });

export type RegisterFormValues = z.infer < typeof registerSchema > ;