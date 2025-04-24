export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  // phone field removed
  password: string;
  terms: boolean;
}

// Union type for all form data types
export type AuthFormData = 
  | LoginFormData
  | RegisterFormData;