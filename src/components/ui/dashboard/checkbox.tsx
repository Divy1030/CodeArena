import * as React from "react";
import { cn } from "@/utils/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-400 text-primary focus:ring-2 focus:ring-primary/50",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };