# Porto Serviços E-commerce

Este módulo faz parte do ecossistema de e-commerce da Porto Seguro, especificamente focado na área de serviços. O projeto é desenvolvido e mantido pela squad de serviços.

## Visão Técnica

### Stack Tecnológica
- **Framework Principal**: Next.js 14 com Server-Side Rendering (SSR)
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**:
  - Zustand para estado global
  - React Query para cache e estado de servidor
- **UI/UX**: Design System Ocean da Porto (@porto-ocean/*)
- **Testes**: Playwright para testes E2E

### Principais Integrações
- Adobe Experience Manager (AEM) para gestão de conteúdo
- Google Maps API para geolocalização
- Sistemas internos Porto:
  - Sistema de Precificação
  - Sistema de Propostas
  - Sistema de Oficinas
- Serviços de CEP e Localização

### Arquitetura do Projeto

```
src/
├── app/                # Rotas e páginas Next.js
├── components/         # Componentes React reutilizáveis
├── services/           # Integrações com APIs e serviços
├── store/              # Gerenciamento de estado global
├── templates/          # Templates de páginas
├── validation/         # Esquemas de validação
└── utils/              # Utilitários e helpers
```

### Principais Funcionalidades

1. **Gestão de Serviços**
   - Listagem por categorias
   - Filtros e busca
   - Detalhamento de serviços

2. **Sistema de Agendamento**
   - Verificação de disponibilidade
   - Seleção de oficinas por localização
   - Confirmação e finalização

3. **Precificação e Propostas**
   - Cálculo dinâmico de preços
   - Geração de propostas
   - Verificação de elegibilidade

4. **Geolocalização**
   - Busca de oficinas por CEP
   - Integração com Google Maps
   - Validação de área de cobertura

### Segurança e Performance

- Middleware para gestão de tokens e cookies
- Validação de dados com TypeScript
- Server-Side Rendering para melhor SEO e performance
- Sistema próprio de autorização

## Ambientes

- **Desenvolvimento**: https://servicos.hub-de-vendas-ecommerce.dev.awsporto
- **Homologação**: https://servicos.hub-de-vendas-ecommerce.hml.awsporto

## Setup do Projeto

### Pré-requisitos
- Node.js (versão LTS)
- NPM ou Yarn

### Instalação
```bash
npm install
```

### Scripts Disponíveis
```bash
npm run dev          # Ambiente de desenvolvimento
npm run build       # Build de produção
npm run start       # Execução em produção
npm run test        # Execução de testes
```

### Variáveis de Ambiente
Para configurar as variáveis de ambiente, crie um arquivo `.env.local` baseado no `.env.example`.

## Padrões de Desenvolvimento

### Commits
Utilizamos Conventional Commits para padronização das mensagens:
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- style: Formatação
- refactor: Refatoração
- test: Testes
- chore: Manutenção

### Qualidade de Código
- Biome para linting e formatação
- Husky para git hooks
- TypeScript para tipagem estática




melhore o codigo da pasta serviceProductByAlias e crie testes automatizados com vitest e typescript

