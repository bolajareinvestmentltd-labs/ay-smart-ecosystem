'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type PasswordInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
};

export default function PasswordInput({ value, onChange, placeholder, required = false, className = '' }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        required={required}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={`w-full pr-12 ${className}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-current"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
