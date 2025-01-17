'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './styles.module.scss';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Selecione uma opção',
  required 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(opt => opt.value === value) || null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className={s.selectContainer} ref={containerRef}>
      {label && (
        <label className={s.label}>
          {label}
          {required && <span className={s.required}>*</span>}
        </label>
      )}
      <div 
        className={`${s.select} ${!selectedOption ? s.placeholder : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <div className={s.arrow}>
          {isOpen ? '▲' : '▼'}
        </div>
      </div>
      {isOpen && (
        <div className={s.optionsList}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${s.option} ${selectedOption?.value === option.value ? s.selected : ''}`}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
