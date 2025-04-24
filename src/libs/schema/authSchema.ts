import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const RegisterFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Combined schema for use in a unified form component
export const AuthFormSchema = RegisterFormSchema.partial().merge(LoginFormSchema.partial());

export const OTPFormSchema = z.object({
  pin: z.string().min(4, "Please enter a valid 4-digit OTP").max(4),
});

export const startingShema = z.object({
  email: z.string().email(),
});

export const GetStartedFormSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordFormSchema = z
  .object({
    Newpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.Newpassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password is required",
        path: ["Newpassword"],
      });
    }

    if (!data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password is required",
        path: ["confirmPassword"],
      });
    }

    if (data.Newpassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
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