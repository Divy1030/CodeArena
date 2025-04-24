'use client';

import AuthForm from '@/features/auth/AuthForm';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Log in to your account</h1>
      
      <AuthForm type="login" />
      
      <p className="mt-4 text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}