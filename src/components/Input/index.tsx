'use client';

import { useEffect, useState } from 'react';
import s from './styles.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ 
  label, 
  error, 
  required, 
  value,
  onChange,
  ...props 
}: InputProps) {
  const [touched, setTouched] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const showError = touched && required && !internalValue;

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={s.inputContainer}>
      {label && (
        <label className={s.label}>
          {label}
          {required && <span className={s.required}>*</span>}
        </label>
      )}
      <input
        {...props}
        value={internalValue}
        className={`${s.input} ${showError ? s.error : ''}`}
        onBlur={(e) => {
          setTouched(true);
          props.onBlur?.(e);
        }}
        onChange={handleChange}
      />
      {showError && (
        <span className={s.errorMessage}>
          {error || 'Este campo é obrigatório'}
        </span>
      )}
    </div>
  );
}
