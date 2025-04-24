import { Control, Controller, FieldValues, Path } from "react-hook-form";
import React from "react";

interface CustomCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
}

export default function CustomCheckbox<T extends FieldValues>({
  name,
  label,
  control,
}: CustomCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex items-center">
          <input
            id={name}
            type="checkbox"
            className="h-4 w-4 rounded"
            {...field}
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
          {label && (
            <label htmlFor={name} className="ml-2 text-sm">
              {label}
            </label>
          )}
          {error && (
            <p className="text-red-500 text-sm ml-2">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}