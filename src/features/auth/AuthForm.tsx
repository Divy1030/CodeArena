"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CombinedAuthFormSchema } from "@/libs/schema/authSchema";
import { AuthFormType } from "./types/auth.types";
import { CombinedFormValues } from "./types/form.types";
import Link from "next/link";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import CustomInput from "@/components/Custom/CustomInput";

interface AuthFormProps {
  type: AuthFormType;
}

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}
 
export default function AuthForm({ type }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use the combined schema for both login and register
  const form = useForm<CombinedFormValues>({
    resolver: zodResolver(CombinedAuthFormSchema),
    defaultValues: {
      // Common fields
      email: '',
      password: '',
      // Login-specific fields
      rememberMe: false,
      // Register-specific fields
      username: '',
      terms: false,
      isAdmin: false
    },
    mode: "onChange"
  });

  const { register, handleSubmit, setValue, control, formState: { errors } } = form;

  // Load saved email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("enteredEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      localStorage.removeItem("enteredEmail");
    }

    // For login form, check if we have a remembered email
    if (type === "login") {
      const rememberedEmail = sessionStorage.getItem("userEmail");
      const rememberMe = sessionStorage.getItem("rememberMe");

      if (rememberedEmail && rememberMe) {
        setValue("email", rememberedEmail);
        setValue("rememberMe", true);
      }
    }
  }, [type, setValue]);

  const onSubmit = async (data: CombinedFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (type === 'login') {
        // Extract only the login-relevant fields
        const loginData = {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe
        };
        
        // Use Next.js API routes
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
        console.log('Login response:', result);

        if (response.ok && result.success) {
          if (result.data && result.data.accessToken) {
            // Store token in localStorage with proper formatting
            localStorage.setItem('token', result.data.accessToken);

            // Also save refresh token if needed
            if (result.data.refreshToken) {
              localStorage.setItem('refreshToken', result.data.refreshToken);
            }

            // Save user data
            if (result.data.user) {
              localStorage.setItem('userData', JSON.stringify(result.data.user));
              
              // Check if the user is an admin
              const isAdmin = result.data.user.role === 'admin';
              localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
              
              // Redirect based on user role
              const redirectPath = isAdmin ? '/admin/home' : '/user/home';
              
              // Handle remember me
              if (loginData.rememberMe) {
                sessionStorage.setItem('userEmail', loginData.email);
                sessionStorage.setItem('rememberMe', 'true');
              }
              
              // Add a delay before redirection
              setTimeout(() => {
                router.push(redirectPath);
              }, 100);
            }
          } else {
            setError('Login successful but no authentication token was received');
          }
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        // Extract only the register-relevant fields
        const registerData = {
          username: data.username || '',
          email: data.email,
          password: data.password,
          isAdmin: data.isAdmin || false
        };
        
        // Determine which endpoint to use based on isAdmin
        const endpointUrl = registerData.isAdmin 
          ? '/api/admin/register' 
          : '/api/auth/register';

        // Use Next.js API routes
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password
          }),
        });

        const result = await response.json();
        console.log('Register response:', result);

        if (response.ok && result.success) {
          // Save email for the login form
          localStorage.setItem('enteredEmail', registerData.email);

          // Show success message
          setError(null);
          
          // Define message based on account type
          const accountType = registerData.isAdmin ? 'admin' : 'user';
          const successMessage = result.message || 
            `Registration successful! Please check your email for verification. You've registered as an ${accountType}.`;
          
          alert(successMessage);

          // Redirect to login page
          router.push('/auth/login');
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      const res = await axios.post("/api/auth/google", {
        idToken,
      });

      console.log("Logged in:", res.data);

      if (res.data.success) {
        const { user, accessToken, refreshToken } = res.data.data;

        // Store token in localStorage to be consistent with regular login
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Save user data
        localStorage.setItem("userData", JSON.stringify(user));
        
        // Check if the user is an admin (consistent with normal login)
        const isAdmin = user.role === 'admin';
        localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        
        // Determine redirect path
        const redirectPath = isAdmin ? '/admin/home' : '/user/home';
        
        // Add a delay before redirection, just like in normal login
        setTimeout(() => {
          router.push(redirectPath);
        }, 100);
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error("Login error", axiosError.response?.data || axiosError.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
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
          {...register('email')}
          className="w-full p-2 border rounded-md"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message?.toString()}
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
            {...register('username')}
            className="w-full p-2 border rounded-md"
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message?.toString()}
            </p>
          )}
        </div>
      )}

      {/* Password - used in both forms */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        {type === 'register' ? (
          <CustomInput<CombinedFormValues>
            name="password"
            label=""
            control={control}
            placeholder="Create a password"
            type="password"
            showStrengthChecker={true}
          />
        ) : (
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your password"
          />
        )}
        {errors.password && !type.includes('register') && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message?.toString()}
          </p>
        )}
      </div>

      {/* Login-specific elements */}
      {type === 'login' && (
        <div className="flex justify-between items-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
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
            {...register('terms')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="terms" className="ml-2 text-sm">
            I agree to the Terms of Service and Privacy Policy
          </label>
          {errors.terms && (
            <p className="text-red-500 text-sm ml-2">
              {errors.terms.message?.toString()}
            </p>
          )}
        </div>
      )}

      {/* Admin checkbox - only for register */}
      {type === 'register' && (
        <div className="flex items-center">
          <input
            id="isAdmin"
            type="checkbox"
            {...register('isAdmin')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 text-sm">
            Register as an admin
          </label>
          <span className="ml-2 text-xs text-gray-500">
            (Admin accounts have additional privileges)
          </span>
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

      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Login Failed")}
        theme="outline" // or "filled_blue", "filled_black"
        size="large" // or "medium", "small"
        shape="rectangular" // or "rectangular", "circle"
        text="continue_with" // or "signup_with", "continue_with"
      />
    </form>
  );
}