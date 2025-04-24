import { Control, Controller, FieldValues, Path } from "react-hook-form";
import React from "react";

interface CustomInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
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
  isLoginForm = false,
}: CustomInputProps<T>) {
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
            <input
              id={name}
              type={type}
              {...field}
              placeholder={placeholder}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
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