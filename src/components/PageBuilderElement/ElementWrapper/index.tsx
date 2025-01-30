'use client';

import React from 'react';
import { PageBuilderElement } from '@/components';
import styles from './styles.module.scss';

interface ElementWrapperProps {
  element: any;
  onEdit?: (updates: any) => void;
  onRemove?: () => void;
}

export function ElementWrapper({ element, onEdit, onRemove }: ElementWrapperProps) {
  const [isEnabled, setIsEnabled] = React.useState(element.isEnabled ?? true);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (onEdit) {
      onEdit({ isEnabled: newState });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.componentName}>{element.template?.name || 'Componente'}</span>
        
        <div className={styles.controls}>
          <label className={styles.toggleSwitch} title={isEnabled ? 'Desativar componente' : 'Ativar componente'}>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
            />
            <span className={styles.slider} />
          </label>
          
          {onRemove && (
            <button 
              onClick={onRemove}
              className={styles.removeButton}
              aria-label="Remover componente"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.content} ${!isEnabled ? styles.disabled : ''}`}>
        <PageBuilderElement 
          element={element}
          onEdit={(updates) => onEdit?.({ ...updates })}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
