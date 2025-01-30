'use client';

import React, { useEffect, useState } from 'react';
import { ToggleComponentConfig, ToggleComponentState } from '@/interfaces/ToggleComponent';
import styles from './styles.module.scss';

interface ToggleElementProps {
  config: ToggleComponentConfig;
  initialState?: ToggleComponentState;
  onStateChange?: (state: ToggleComponentState) => void;
}

export function ToggleElement({ config, initialState, onStateChange }: ToggleElementProps) {
  const [activeVariant, setActiveVariant] = useState<'A' | 'B'>(
    initialState?.activeVariant || config.defaultVariant
  );

  // Carregar estado da sessão se existir
  useEffect(() => {
    if (config.sessionKey) {
      const savedState = sessionStorage.getItem(`toggle_${config.sessionKey}`);
      if (savedState) {
        setActiveVariant(savedState as 'A' | 'B');
      }
    }
  }, [config.sessionKey]);

  const handleToggle = () => {
    const newVariant = activeVariant === 'A' ? 'B' : 'A';
    setActiveVariant(newVariant);

    // Salvar na sessão se necessário
    if (config.sessionKey) {
      sessionStorage.setItem(`toggle_${config.sessionKey}`, newVariant);
    }

    // Notificar mudança
    if (onStateChange) {
      onStateChange({
        activeVariant: newVariant,
        sessionKey: config.sessionKey
      });
    }
  };

  return (
    <div className={styles.toggleElement}>
      <div className={styles.toggleHeader}>
        <h3>{config.name}</h3>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={activeVariant === 'B'}
            onChange={handleToggle}
          />
          <span className={styles.slider} />
        </label>
      </div>
      <div className={styles.toggleInfo}>
        <span>Variante ativa: {config.variants[activeVariant].name}</span>
        <p className={styles.description}>{config.description}</p>
      </div>
    </div>
  );
}
