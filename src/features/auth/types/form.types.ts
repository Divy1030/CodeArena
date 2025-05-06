export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  terms: boolean;
  isAdmin?: boolean; // Add this field for admin registration
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpFormData {
  email: string;
  otp: string;
}

// Add the CombinedFormValues interface that includes all fields from login and register
export interface CombinedFormValues {
  // Common fields
  email: string;
  password: string;
  
  // Login-specific fields
  rememberMe?: boolean;
  
  // Register-specific fields
  username?: string;
  terms?: boolean;
  isAdmin?: boolean;
}

// Union type for all form data types
export type AuthFormData = 
  | LoginFormData
  | RegisterFormData
  | ForgotPasswordFormData
  | ResetPasswordFormData
  | VerifyOtpFormData;