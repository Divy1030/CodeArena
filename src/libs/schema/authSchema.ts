import { z } from "zod";

// Core schemas with consistent naming and structure
export const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  isAdmin: z.boolean().optional().default(false),
});

// Create type-safe schemas for the combined form
const BaseAuthFormSchema = z.object({
  // Common fields
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  
  // Optional fields for both forms
  rememberMe: z.boolean().optional().default(false),
  username: z.string().optional(),
  terms: z.boolean().optional(),
  isAdmin: z.boolean().optional().default(false),
});

// This lets TypeScript know about the _errors property
export type FormErrors = { _errors: string[] };

// Create a combined schema with proper typing for the refine method
export const CombinedAuthFormSchema = BaseAuthFormSchema.superRefine(
  (data, ctx) => {
    // If username exists, we're in register mode and need to validate register-specific fields
    if (data.username !== undefined && data.username !== '') {
      // Check username length
      if (data.username.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username must be at least 3 characters",
          path: ["username"]
        });
      }
      
      // Check password requirements for registration
      if (data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters for registration",
          path: ["password"]
        });
      }
      
      if (!/[a-z]/.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter",
          path: ["password"]
        });
      }
      
      if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one uppercase letter",
          path: ["password"]
        });
      }
      
      if (!/[0-9]/.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number",
          path: ["password"]
        });
      }
      
      // Check terms acceptance
      if (data.terms !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You must accept the terms and conditions",
          path: ["terms"]
        });
      }
    }
  }
);

// Password reset and verification schemas
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Legacy schemas can remain for backward compatibility
export const OTPFormSchema = z.object({
  pin: z.string().min(4, "Please enter a valid 4-digit OTP").max(4),
});

export const GetStartedFormSchema = z.object({
  email: z.string().email(),
});

export const SettingsPasswordFormSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    Newpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.Newpassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SettingsUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});