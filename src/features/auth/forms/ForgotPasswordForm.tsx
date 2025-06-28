"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/libs/schema/authSchema";
import LabelButton from "@/components/Custom/LabelButton";
import Link from "next/link";
import CustomInput from "@/components/Custom/CustomInput";
import { ForgotPasswordFormData } from "../types/form.types";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Sending forgot password request for:', data.email);
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      console.log('Forgot password response:', result);
      
      if (response.ok) {
        setSuccess("If your email is registered with us, you will receive a verification code shortly.");
        
        // Store email in localStorage to use it in the verification step
        localStorage.setItem('resetEmail', data.email);
        
        // Redirect to verify OTP page after success message
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&purpose=reset`);
        }, 2000);
      } else {
        setError(result.message || "Failed to send verification code");
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
      <p className="text-center text-gray-600">
        Enter your email address and we&apos;ll send you a verification code to reset your password.
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

      <CustomInput<ForgotPasswordFormData>
        name="email"
        label="Email Address"
        control={control}
        placeholder="Enter your email"
        type="email"
      />

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        {isSubmitting ? "Sending..." : "Send Verification Code"}
      </LabelButton>

      <div className="text-center">
        <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
          Back to Login
        </Link>
      </div>
    </form>
  );
}