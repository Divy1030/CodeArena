"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LoginFormSchema, RegisterFormSchema } from "@/libs/schema/authSchema";
import { AuthFormType } from "./types/auth.types";
import Link from "next/link";
import { z } from "zod";

interface AuthFormProps {
  type: AuthFormType;
}

// Define form data types based on schemas
type LoginFormValues = z.infer<typeof LoginFormSchema>;
type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export default function AuthForm({ type }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Choose the correct schema based on form type
  const schema = type === 'login' ? LoginFormSchema : RegisterFormSchema;
  
  // Setup form with React Hook Form
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: type === 'login' 
      ? { email: '', password: '', rememberMe: false } as LoginFormValues
      : { username: '', email: '', password: '', terms: false } as RegisterFormValues,
    mode: "onChange"
  });

  // Load saved email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("enteredEmail");
    if (savedEmail) {
      form.setValue("email", savedEmail);
      localStorage.removeItem("enteredEmail");
    }
    
    // For login form, check if we have a remembered email
    if (type === "login") {
      const rememberedEmail = sessionStorage.getItem("userEmail");
      const rememberMe = sessionStorage.getItem("rememberMe");

      if (rememberedEmail && rememberMe) {
        form.setValue("email", rememberedEmail);
        form.setValue("rememberMe", true);
      }
    }
  }, [type, form]);

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (type === 'login') {
        const loginData = data as LoginFormValues;
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: loginData.email, 
            password: loginData.password 
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Save token if present
          if (result.token) {
            localStorage.setItem('token', result.token);
          }
          
          // Handle remember me
          if (loginData.rememberMe) {
            sessionStorage.setItem('userEmail', loginData.email);
            sessionStorage.setItem('rememberMe', 'true');
          } else {
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('rememberMe');
          }
          
          router.push('/dashboard');
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        const registerData = data as RegisterFormValues;
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: registerData.username,
            email: registerData.email,
            password: registerData.password 
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Save email for the login form
          localStorage.setItem('enteredEmail', registerData.email);
          router.push('/auth/login');
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Email field - used in both forms */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...form.register('email')}
          className="w-full p-2 border rounded-md"
          placeholder="Enter your email"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.email.message?.toString()}
          </p>
        )}
      </div>
      
      {/* Username - only for register */}
      {type === 'register' && (
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...form.register('username')}
            className="w-full p-2 border rounded-md"
            placeholder="Choose a username"
          />
          {type === 'register' && (form.formState.errors as any).username && (
            <p className="text-red-500 text-sm mt-1">
              {(form.formState.errors as any).username.message?.toString()}
            </p>
          )}
        </div>
      )}
      
      {/* Phone field removed */}
      
      {/* Password - used in both forms */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...form.register('password')}
          className="w-full p-2 border rounded-md"
          placeholder={type === 'login' ? "Enter your password" : "Create a password"}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.password.message?.toString()}
          </p>
        )}
      </div>
      
      {/* Login-specific elements */}
      {type === 'login' && (
        <div className="flex justify-between items-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              {...form.register('rememberMe')}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
          </div>
        </div>
      )}
      
      {/* Terms checkbox - only for register */}
      {type === 'register' && (
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...form.register('terms')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="terms" className="ml-2 text-sm">
            I agree to the Terms of Service and Privacy Policy
          </label>
          {(form.formState.errors as any).terms && (
            <p className="text-red-500 text-sm ml-2">
              {(form.formState.errors as any).terms.message?.toString()}
            </p>
          )}
        </div>
      )}
      
      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        {isSubmitting
          ? type === 'login' ? 'Logging in...' : 'Signing up...'
          : type === 'login' ? 'Login' : 'Sign up'}
      </button>
    </form>
  );
}