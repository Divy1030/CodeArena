"use client";
import ForgotPasswordForm from "@/features/auth/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <p className="mb-6 text-gray-600 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p> */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}