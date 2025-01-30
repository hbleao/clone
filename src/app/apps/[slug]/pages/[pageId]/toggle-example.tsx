'use client';

import React from 'react';
import { ToggleElement } from '@/components/PageBuilderElement/ToggleElement';
import { ToggleContentRenderer } from '@/components/PageBuilderElement/ToggleContentRenderer';
import { ToggleComponentConfig } from '@/interfaces/ToggleComponent';
import styles from './toggle-example.module.scss';

const exampleConfig: ToggleComponentConfig = {
  id: 'hero-toggle',
  name: 'Hero Section Toggle',
  description: 'Alternar entre o hero original e a nova versão com CTA diferente',
  defaultVariant: 'A',
  variants: {
    A: {
      componentId: 'hero-original',
      name: 'Hero Original'
    },
    B: {
      componentId: 'hero-new',
      name: 'Hero com novo CTA'
    }
  },
  sessionKey: 'hero-ab-test'
};

export function ToggleExample() {
  const [state, setState] = React.useState({
    activeVariant: exampleConfig.defaultVariant,
    sessionKey: exampleConfig.sessionKey
  });

  return (
    <div className={styles.container}>
      <h2>Exemplo de Feature Toggle</h2>
      
      <div className={styles.toggleContainer}>
        <ToggleElement
          config={exampleConfig}
          initialState={state}
          onStateChange={setState}
        />
        
        <ToggleContentRenderer
          config={exampleConfig}
          state={state}
        />
      </div>
    </div>
  );
}
