'use client';

import React from 'react';
import { ToggleComponentConfig, ToggleComponentState } from '@/interfaces/ToggleComponent';
import { FormElementInstance } from '@/components/PageBuilder/types';
import { PageBuilderElement } from '@/components';
import styles from './styles.module.scss';

interface ToggleContentRendererProps {
  config: ToggleComponentConfig;
  state: ToggleComponentState;
}

export function ToggleContentRenderer({ config, state }: ToggleContentRendererProps) {
  const activeComponent = config.variants[state.activeVariant];

  if (!activeComponent) {
    return (
      <div className={styles.error}>
        Componente não encontrado
      </div>
    );
  }

  return (
    <div className={styles.toggleContent}>
      <div className={styles.activeComponent}>
        <PageBuilderElement
          element={activeComponent}
          onEdit={(updatedElement: FormElementInstance) => {
            // Aqui você pode implementar a lógica de atualização do componente
            console.log('Componente atualizado:', updatedElement);
          }}
          onRemove={() => {
            // Opcional: implementar lógica de remoção
            console.log('Tentativa de remover componente');
          }}
        />
      </div>
    </div>
  );
}
