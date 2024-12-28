# Guia de Drag and Drop de Seções

## 📌 Visão Geral

Este documento descreve as regras e comportamentos do sistema de drag and drop para gerenciamento de seções em páginas.

## 🚦 Regras de Reordenação

### 1. Limites de Seções

- **Número Máximo de Seções**: 10 seções por página
- **Número Mínimo de Seções**: 0 seções

### 2. Restrições de Movimentação

#### 2.1 Distância Mínima
- Cada seção só pode ser movida para uma posição distante pelo menos 1 posição da sua localização original
- Objetivo: Prevenir movimentações acidentais ou muito pequenas

#### 2.2 Consistência de Template
- Só é possível reordenar seções com o mesmo tipo de template
- Impede mistura de seções com estruturas diferentes

### 3. Validações Durante o Arrasto

#### 3.1 Pré-Validação
- Verifica se a movimentação é permitida antes de iniciar o arrasto
- Bloqueia movimentações inválidas instantaneamente

#### 3.2 Feedback Visual
- Animação de "shake" para movimentações inválidas
- Indicadores de posição durante o arrasto
- Destaque da seção sendo arrastada

## 🎨 Experiência do Usuário

### 4. Acessibilidade

#### 4.1 Suporte para Teclado
- Possibilidade de reordenar usando apenas o teclado
- Navegação entre seções com Tab
- Descrições ARIA para leitores de tela

#### 4.2 Feedback
- Notificações toast para:
  - Sucesso na reordenação
  - Erro em movimentações inválidas
  - Limite de seções atingido

## 🛡️ Tratamento de Erros

### 5. Cenários de Erro

#### 5.1 Limite de Seções Excedido
- Impede adicionar mais de 10 seções
- Exibe mensagem de erro específica

#### 5.2 Movimentação Inválida
- Bloqueia movimentação entre templates diferentes
- Impede movimentações muito curtas

## 🔧 Configurações Personalizáveis

```typescript
// Constantes configuráveis
const MAX_SECTIONS = 10;        // Número máximo de seções
const MIN_SECTIONS_BETWEEN_DRAG = 1;  // Distância mínima de movimentação
```

## 💡 Dicas de Uso

- Use drag and drop para reorganizar rapidamente o conteúdo
- Preste atenção aos feedbacks visuais durante a movimentação
- Em caso de dúvida, consulte este guia

## 🔍 Troubleshooting

### Problemas Comuns

1. **Seção não move**
   - Verifique se não ultrapassou o limite de 10 seções
   - Confirme que está movendo para uma posição válida
   - Certifique-se de que as seções têm o mesmo template

2. **Feedback visual não aparece**
   - Verifique configurações de acessibilidade do navegador
   - Confirme suporte a animações CSS

## 📊 Métricas de Interação

- Rastreamos a usabilidade do drag and drop
- Feedbacks são coletados para melhorias contínuas

---

**Última Atualização**: 26 de Dezembro de 2024
**Versão**: 1.0.0
