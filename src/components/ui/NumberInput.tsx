
import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  id?: string;
  dir?: "rtl" | "ltr";
}

const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  error,
  required = false,
  id,
  dir = "rtl",
}: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Based on API requirements, allow only digits and ensure at least 8 digits
    if (/^[0-9]*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2" dir={dir}>
      {label && (
        <Label htmlFor={id} className="font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={id}
        type="text"
        pattern="[0-9]*"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        dir="ltr" // Keep numbers left-to-right even in RTL context
        className={cn(
          "transition-all duration-200 text-right",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      />
      {error && (
        <p className="text-destructive text-sm font-medium animate-slide-down">{error}</p>
      )}
    </div>
  );
};

export default NumberInput;
