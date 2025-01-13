'use client';

import { useState } from 'react';
import s from './styles.module.scss';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, required, ...props }: TextareaProps) {
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState(props.defaultValue || '');
  const showError = touched && required && !value;

  return (
    <div className={s.textareaContainer}>
      {label && (
        <label className={s.label}>
          {label}
          {required && <span className={s.required}>*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`${s.textarea} ${showError ? s.error : ''}`}
        onBlur={(e) => {
          setTouched(true);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.onChange) {
            props.onChange(e);
          }
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
