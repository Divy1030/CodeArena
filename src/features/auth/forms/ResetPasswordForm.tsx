"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import LabelButton from "@/components/Custom/LabelButton";
import CustomInput from "@/components/Custom/CustomInput";

// Define schema for password reset
const ResetPasswordSchema = z.object({
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

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  
  // Initialize useForm hook at the top level - not inside conditionals
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
    mode: "onChange",
  });

  // Move the email check to useEffect
  useEffect(() => {
    const emailValue = searchParams.get('email') || localStorage.getItem('resetEmail') || '';
    setEmail(emailValue);
    
    // If no email in URL or localStorage, redirect to forgot password
    if (!emailValue) {
      router.push('/auth/forgot-password');
    }
  }, [router, searchParams]);

  // If no email, render nothing while the redirect happens
  if (!email) {
    return null;
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Update password
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword: data.newPassword
        }),
      });

      const result = await response.json();
      console.log('Password update response:', result);

      if (response.ok && result.success) {
        setSuccess("Password has been reset successfully! Redirecting to login...");
        
        // Clear the reset email from storage
        localStorage.removeItem('resetEmail');
        
        // Redirect to login after success
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password");
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <p className="text-center text-gray-600">
        Create a new password for your account.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {email && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Resetting password for: <strong>{email}</strong>
        </div>
      )}

      <CustomInput<ResetPasswordFormValues>
        name="newPassword"
        label="New Password"
        control={control}
        placeholder="Create a new password"
        type="password"
        showStrengthChecker={true}
      />

      <CustomInput<ResetPasswordFormValues>
        name="confirmPassword"
        label="Confirm New Password"
        control={control}
        placeholder="Confirm your new password"
        type="password"
      />

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </LabelButton>
    </form>
  );
}