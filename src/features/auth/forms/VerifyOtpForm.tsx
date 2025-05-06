"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import LabelButton from "@/components/Custom/LabelButton";
import CustomInput from "@/components/Custom/CustomInput";

// Define schema for OTP verification
const VerifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});

type VerifyOtpFormData = z.infer<typeof VerifyOtpSchema>;

export default function VerifyOtpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || 'registration'; // 'registration' or 'reset'

  const { control, handleSubmit } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { email, otp: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Choose endpoint based on purpose
      const endpoint = purpose === 'reset' 
        ? '/api/auth/verify-reset-password-otp'
        : '/api/auth/verify-otp';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccess("Code verified successfully!");
        
        // Save email to localStorage
        localStorage.setItem('resetEmail', data.email);
        
        // Redirect based on purpose
        setTimeout(() => {
          if (purpose === 'reset') {
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
          } else {
            router.push('/login');
          }
        }, 1500);
      } else {
        setError(result.message || "Verification failed");
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = purpose === 'reset' ? 'Verify Password Reset Code' : 'Verify Email';
  const description = purpose === 'reset' 
    ? 'Please enter the verification code sent to your email to reset your password.'
    : 'Please enter the verification code sent to your email to verify your account.';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <p className="text-center text-gray-600">{description}</p>
      
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
          Verification code sent to: <strong>{email}</strong>
        </div>
      )}

      <CustomInput<VerifyOtpFormData>
        name="otp"
        label="Verification Code"
        control={control}
        placeholder="Enter the 6-digit code"
        type="text"
      />

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </LabelButton>

      <div className="text-center">
        <button 
          type="button"
          onClick={async () => {
            if (email) {
              try {
                setIsSubmitting(true);
                const endpoint = purpose === 'reset'
                  ? '/api/auth/forgot-password'
                  : '/api/auth/resend-otp';
                
                const response = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });
                
                const result = await response.json();
                if (response.ok && result.success) {
                  setSuccess("Verification code resent. Please check your email.");
                } else {
                  setError(result.message || "Failed to resend verification code");
                }
              } catch (err) {
                setError("Failed to resend verification code");
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
          className="text-blue-600 hover:underline text-sm"
        >
          Resend verification code
        </button>
      </div>
    </form>
  );
}