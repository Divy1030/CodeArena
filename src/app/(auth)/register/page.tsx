'use client';

import AuthForm from '@/features/auth/AuthForm';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      
      <AuthForm type="register" />
      
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
