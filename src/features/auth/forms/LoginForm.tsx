import { Control } from "react-hook-form";
import CustomInput from "@/components/Custom/CustomInput";
import LabelButton from "@/components/Custom/LabelButton";
import Link from "next/link";
import CustomCheckbox from "@/components/Custom/CustomCheckbox";
import { AuthFormData } from "@/features/auth/types/form.types";

interface LoginFormProps {
  control: Control<AuthFormData>;
  isSubmitting: boolean;
  password: string;
}

export default function LoginForm({ control, isSubmitting }: LoginFormProps) {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder="Enter your email"
        type="text"
        isLoginForm={true}
      />
      <CustomInput
        name="password"
        label="Password"
        control={control}
        placeholder="Enter your password"
        type="password"
        isLoginForm={true}
      />

      <div className="flex justify-between items-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
        <div className="flex items-center gap-2">
          <CustomCheckbox
            name="rememberMe"
            label="Remember me"
            control={control}
          />
        </div>
      </div>

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        Login
      </LabelButton>
    </div>
  );
}