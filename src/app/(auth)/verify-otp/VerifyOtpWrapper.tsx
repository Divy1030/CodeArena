"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VerifyOtpForm from "@/features/auth/forms/VerifyOtpForm";

export default function VerifyOtpWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  // Don't render anything if no email - will redirect
  if (!email) {
    return null;
  }

  return <VerifyOtpForm />;
}