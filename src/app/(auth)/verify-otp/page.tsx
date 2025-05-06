"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VerifyOtpForm from "@/features/auth/forms/VerifyOtpForm";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/auth/login');
    }
  }, [email, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">Verify Email</h1>
        <p className="mb-6 text-gray-600 text-center">
          We've sent a verification code to your email. Please enter it below.
        </p> */}
        <VerifyOtpForm />
      </div>
    </div>
  );
}