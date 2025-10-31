'use client'; // This is a client component

import { useState, ChangeEvent } from 'react';

// A utility function to keep the logic separate
const formatToDigitsOnly = (input: string): string => {
  return input.replace(/\D/g, '');
};

type PhoneNumberInputProps = {
  onDigitsChange: (digits: string) => void;
  // You can add more standard input props here
  placeholder?: string;
  className?: string;
};

export default function PhoneNumberInput({
  onDigitsChange,
  placeholder,
  className,
}: PhoneNumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const digitsOnly = formatToDigitsOnly(inputValue);

    // Update the local state for the input's display value
    setDisplayValue(inputValue);
    
    // Call the parent handler with the formatted, digits-only value
    onDigitsChange(digitsOnly);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
