"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/features/auth/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/auth/forgot-password');
    }
  }, [email, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <p className="mb-6 text-gray-600 text-center">
          Enter the verification code sent to your email and create a new password.
        </p> */}
        <ResetPasswordForm />
      </div>
    </div>
  );
}