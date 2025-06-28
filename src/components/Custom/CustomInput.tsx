import { Control, Controller, FieldValues, Path } from "react-hook-form";
import React, { useState } from "react";

// Update the interface to properly handle the generic type
interface CustomInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>; // This is the key part - ensuring Control is properly typed
  placeholder?: string;
  type?: string;
  isLoginForm?: boolean;
  showStrengthChecker?: boolean;
}

export default function CustomInput<T extends FieldValues>({
  name,
  label,
  control,
  placeholder = "",
  type = "text",
  // isLoginForm = false,
  showStrengthChecker = false,
}: CustomInputProps<T>) {
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password: string) => {
    // Skip empty passwords
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    let score = 0;
    let message = "";
    let color = "";

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Set message and color based on score
    if (score <= 2) {
      message = "Weak";
      color = "bg-red-500";
    } else if (score <= 4) {
      message = "Moderate";
      color = "bg-yellow-500";
    } else {
      message = "Strong";
      color = "bg-green-500";
    }

    setPasswordStrength({ score, message, color });
  };

  return (
    <div className="w-full">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative">
              <input
                id={name}
                type={type === "password" && showPassword ? "text" : type}
                {...field}
                placeholder={placeholder}
                className={`w-full p-2 border rounded-md ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => {
                  field.onChange(e);
                  if (showStrengthChecker && type === "password") {
                    checkPasswordStrength(e.target.value);
                  }
                }}
              />
              
              {/* Password toggle button */}
              {type === "password" && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              )}
            </div>
            
            {/* Password strength indicator */}
            {showStrengthChecker && type === "password" && field.value && (
              <div className="mt-2">
                <div className="bg-gray-200 h-1.5 rounded-full mb-1">
                  <div 
                    className={`h-full rounded-full ${passwordStrength.color}`} 
                    style={{ width: `${Math.min((passwordStrength.score/6) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${
                  passwordStrength.color === "bg-red-500" ? "text-red-500" : 
                  passwordStrength.color === "bg-yellow-500" ? "text-yellow-600" : 
                  "text-green-600"
                }`}>
                  {passwordStrength.message}
                </p>
                {passwordStrength.score <= 4 && field.value && (
                  <ul className="text-xs text-gray-500 mt-1 list-disc pl-4">
                    {field.value.length < 8 && (
                      <li>Password should be at least 8 characters</li>
                    )}
                    {!/[a-z]/.test(field.value) && (
                      <li>Include lowercase letters</li>
                    )}
                    {!/[A-Z]/.test(field.value) && (
                      <li>Include uppercase letters</li>
                    )}
                    {!/[0-9]/.test(field.value) && (
                      <li>Include numbers</li>
                    )}
                    {!/[^a-zA-Z0-9]/.test(field.value) && (
                      <li>Include special characters</li>
                    )}
                  </ul>
                )}
              </div>
            )}
            
            {error && (
              <p className="text-red-500 text-sm mt-1">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

// Simple eye icons for password visibility toggle
const EyeIcon = ({ className }: { className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
    />
  </svg>
);

const EyeOffIcon = ({ className }: { className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
    />
  </svg>
);