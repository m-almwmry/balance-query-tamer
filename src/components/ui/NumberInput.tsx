
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
}: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[0-9]*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
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
        className={cn(
          "transition-all duration-200",
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
