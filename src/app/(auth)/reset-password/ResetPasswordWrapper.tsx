"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/features/auth/forms/ResetPasswordForm";

export default function ResetPasswordWrapper() {
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
        <ResetPasswordForm />
      </div>
    </div>
  );
}