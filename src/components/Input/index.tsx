'use client';

import { useState } from 'react';
import s from './styles.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, required, ...props }: InputProps) {
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState(props.defaultValue || '');
  const showError = touched && required && !value;

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
        className={`${s.input} ${showError ? s.error : ''}`}
        onBlur={(e) => {
          setTouched(true);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
      />
      {showError && (
        <span className={s.errorMessage}>
          {error || 'Este campo é obrigatório'}
        </span>
      )}
    </div>
  );
}
