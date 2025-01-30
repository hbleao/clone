'use client';

import React from 'react';
import { FormElementInstance } from '@/components/PageBuilder/types';
import { ToggleComponentConfig } from '@/interfaces/ToggleComponent';
import styles from './styles.module.scss';

interface ToggleConfigProps {
  onSave: (config: ToggleComponentConfig) => void;
  availableComponents: FormElementInstance[];
  initialConfig?: Partial<ToggleComponentConfig>;
}

export function ToggleConfig({ onSave, availableComponents, initialConfig }: ToggleConfigProps) {
  const [config, setConfig] = React.useState<Partial<ToggleComponentConfig>>({
    name: '',
    description: '',
    defaultVariant: 'A',
    ...initialConfig
  });

  const [selectedComponents, setSelectedComponents] = React.useState<{
    A?: FormElementInstance;
    B?: FormElementInstance;
  }>({
    A: config.variants?.A,
    B: config.variants?.B
  });

  const handleSave = () => {
    if (!config.name || !selectedComponents.A || !selectedComponents.B) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSave({
      id: config.id || crypto.randomUUID(),
      name: config.name,
      description: config.description || '',
      defaultVariant: config.defaultVariant || 'A',
      variants: {
        A: selectedComponents.A,
        B: selectedComponents.B
      },
      sessionKey: config.sessionKey
    });
  };

  return (
    <div className={styles.configContainer}>
      <h3>Configurar Toggle</h3>
      
      <div className={styles.field}>
        <label>Nome do Toggle</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          placeholder="Ex: Hero Section A/B Test"
        />
      </div>

      <div className={styles.field}>
        <label>Descrição</label>
        <textarea
          value={config.description}
          onChange={(e) => setConfig({ ...config, description: e.target.value })}
          placeholder="Descreva o propósito deste toggle..."
        />
      </div>

      <div className={styles.field}>
        <label>Variante Padrão</label>
        <select
          value={config.defaultVariant}
          onChange={(e) => setConfig({ ...config, defaultVariant: e.target.value as 'A' | 'B' })}
        >
          <option value="A">Variante A</option>
          <option value="B">Variante B</option>
        </select>
      </div>

      <div className={styles.variants}>
        <div className={styles.variantConfig}>
          <h4>Variante A</h4>
          <select
            value={selectedComponents.A?.id}
            onChange={(e) => {
              const component = availableComponents.find(c => c.id === e.target.value);
              setSelectedComponents({ ...selectedComponents, A: component });
            }}
          >
            <option value="">Selecione um componente</option>
            {availableComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.variantConfig}>
          <h4>Variante B</h4>
          <select
            value={selectedComponents.B?.id}
            onChange={(e) => {
              const component = availableComponents.find(c => c.id === e.target.value);
              setSelectedComponents({ ...selectedComponents, B: component });
            }}
          >
            <option value="">Selecione um componente</option>
            {availableComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label>Chave de Sessão (opcional)</label>
        <input
          type="text"
          value={config.sessionKey}
          onChange={(e) => setConfig({ ...config, sessionKey: e.target.value })}
          placeholder="Ex: hero-ab-test"
        />
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        Salvar Toggle
      </button>
    </div>
  );
}
