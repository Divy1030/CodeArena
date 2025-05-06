import { Control } from "react-hook-form";
import CustomInput from "@/components/Custom/CustomInput";
import Link from "next/link";
import CustomCheckbox from "@/components/Custom/CustomCheckbox";
import LabelButton from "@/components/Custom/LabelButton";
import { AuthFormData } from "@/features/auth/types/form.types";

interface RegisterFormProps {
  control: Control<AuthFormData>;
  isSubmitting: boolean;
  password: string;
}

export default function RegisterForm({
  control,
  isSubmitting,
}: RegisterFormProps) {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder="Enter your email"
        type="text"
      />
      <CustomInput
        name="username"
        label="Username"
        control={control}
        placeholder="Choose a username"
        type="text"
      />
      <div className="relative">
        <CustomInput
          name="password"
          label="Password"
          control={control}
          placeholder="Create a password"
          type="password"
          showStrengthChecker={true}
        />
      </div>

      <div className="flex items-start sm:items-center gap-2">
        <CustomCheckbox name="terms" label="" control={control} />
        <p className="text-sm">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-blue-600 hover:underline"
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
      
      {/* Admin checkbox */}
      <div className="flex items-start sm:items-center gap-2">
        <CustomCheckbox name="isAdmin" label="" control={control} />
        <p className="text-sm">
          Register as an Admin
          <span className="text-xs text-gray-500 block">
            (Admin accounts have additional privileges to manage contests and users)
          </span>
        </p>
      </div>

      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        Sign Up
      </LabelButton>
    </div>
  );
}