# Guia Definitivo de CSS Moderno (2020-2024)

## 1. Nomenclatura de Classes: BEM (Block Element Modifier)

### 1.1 Princípios Fundamentais
```css
/* Estrutura BEM */
.block { }
.block__element { }
.block--modifier { }

/* Exemplo Prático */
.card { }
.card__title { }
.card--highlighted { }
.card__button--disabled { }
```

#### Benefícios
- Clareza na estrutura
- Redução de especificidade
- Facilita manutenção
- Torna o código mais legível

### 1.2 Boas Práticas
- Use nomes descritivos
- Evite aninhamento profundo
- Mantenha consistência
- Prefira classes a IDs

## 2. Responsividade Moderna

### 2.1 Media Queries Inteligentes
```css
/* Mobile First */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1140px;
  }
}
```

### 2.2 Unidades Fluidas
```css
/* Tamanho de fonte responsivo */
.title {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

/* Espaçamento fluido */
.section {
  padding: clamp(1rem, 5vw, 4rem);
}
```

## 3. Flexbox: Layout Moderno e Avançado

### 3.1 Propriedades do Contêiner Flex (display: flex)

#### 3.1.1 flex-direction
```css
.container {
  /* Direções principais */
  flex-direction: row;           /* Padrão: horizontal */
  flex-direction: row-reverse;   /* Horizontal invertido */
  flex-direction: column;        /* Vertical */
  flex-direction: column-reverse; /* Vertical invertido */
}
```

#### 3.1.2 flex-wrap
```css
.container {
  /* Comportamentos de quebra */
  flex-wrap: nowrap;      /* Padrão: não quebra */
  flex-wrap: wrap;        /* Quebra para próxima linha */
  flex-wrap: wrap-reverse; /* Quebra invertendo ordem */
}
```

#### 3.1.3 justify-content
```css
.container {
  /* Alinhamento no eixo principal */
  justify-content: flex-start;     /* Início */
  justify-content: flex-end;       /* Final */
  justify-content: center;         /* Centro */
  justify-content: space-between;  /* Espaço entre itens */
  justify-content: space-around;   /* Espaço ao redor */
  justify-content: space-evenly;   /* Espaço distribuído igualmente */
}
```

#### 3.1.4 align-items
```css
.container {
  /* Alinhamento no eixo transversal */
  align-items: stretch;     /* Padrão: estica */
  align-items: flex-start;  /* Alinha no início */
  align-items: flex-end;    /* Alinha no final */
  align-items: center;      /* Centraliza */
  align-items: baseline;    /* Alinha pela linha de base do texto */
}
```

#### 3.1.5 align-content
```css
.container {
  /* Alinhamento de múltiplas linhas */
  align-content: flex-start;     /* Início */
  align-content: flex-end;       /* Final */
  align-content: center;         /* Centro */
  align-content: space-between;  /* Espaço entre linhas */
  align-content: space-around;   /* Espaço ao redor */
  align-content: stretch;        /* Estica linhas */
}
```

### 3.2 Propriedades dos Itens Flex

#### 3.2.1 flex-grow
```css
.item {
  /* Capacidade de crescimento */
  flex-grow: 0;  /* Padrão: não cresce */
  flex-grow: 1;  /* Cresce proporcionalmente */
  flex-grow: 2;  /* Cresce mais rápido */
}

/* Exemplo de distribuição proporcional */
.container {
  display: flex;
}
.item-1 { flex-grow: 1; }    /* 1 parte */
.item-2 { flex-grow: 2; }    /* 2 partes */
.item-3 { flex-grow: 1; }    /* 1 parte */
```

#### 3.2.2 flex-shrink
```css
.item {
  /* Capacidade de encolhimento */
  flex-shrink: 1;  /* Padrão: encolhe proporcionalmente */
  flex-shrink: 0;  /* Não encolhe */
}
```

#### 3.2.3 flex-basis
```css
.item {
  /* Tamanho base antes da distribuição */
  flex-basis: auto;     /* Padrão: tamanho do conteúdo */
  flex-basis: 0;        /* Ignora tamanho do conteúdo */
  flex-basis: 200px;    /* Largura fixa */
  flex-basis: 50%;      /* Porcentagem do contêiner */
}
```

#### 3.2.4 flex (Atalho)
```css
.item {
  /* Combinação de grow, shrink e basis */
  flex: 0 1 auto;       /* Padrão */
  flex: 1;              /* flex-grow: 1, outros padrão */
  flex: 2 1 100px;      /* grow: 2, shrink: 1, basis: 100px */
  flex: none;           /* 0 0 auto */
}
```

#### 3.2.5 align-self
```css
.item {
  /* Alinhamento individual */
  align-self: auto;         /* Herda do contêiner */
  align-self: flex-start;   /* Alinha no início */
  align-self: flex-end;     /* Alinha no final */
  align-self: center;       /* Centraliza */
  align-self: baseline;     /* Alinha pela linha de base */
  align-self: stretch;      /* Estica */
}
```

### 3.3 Casos de Uso Avançados

#### Layout de Cartões Responsivo
```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 calc(33.333% - 1rem);
  min-width: 250px;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex-grow: 1;
}
```

#### Barra de Navegação Complexa
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-menu {
  display: flex;
  gap: 1rem;
}

.nav-item {
  flex-shrink: 0;
}

.search-box {
  flex-grow: 1;
  margin-left: 1rem;
}
```

## 4. CSS Grid: Layout Complexo e Detalhado

### 4.1 Propriedades do Contêiner Grid

#### 4.1.1 grid-template-columns
```css
.container {
  /* Definição de colunas */
  grid-template-columns: 100px 200px 100px;  /* Colunas fixas */
  grid-template-columns: 1fr 2fr 1fr;        /* Proporções flexíveis */
  grid-template-columns: repeat(3, 1fr);     /* 3 colunas iguais */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsivo */
}
```

#### 4.1.2 grid-template-rows
```css
.container {
  /* Definição de linhas */
  grid-template-rows: 100px 200px 100px;  /* Linhas fixas */
  grid-template-rows: 1fr 2fr 1fr;        /* Proporções flexíveis */
  grid-template-rows: repeat(3, 1fr);     /* 3 linhas iguais */
}
```

#### 4.1.3 grid-template-areas
```css
.container {
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### 4.1.4 gap
```css
.container {
  /* Espaçamento entre células */
  row-gap: 1rem;        /* Espaço entre linhas */
  column-gap: 1rem;     /* Espaço entre colunas */
  gap: 1rem;            /* Atalho para row e column gap */
}
```

#### 4.1.5 justify-items e align-items
```css
.container {
  /* Alinhamento dos itens na grade */
  justify-items: start;    /* Alinha no início horizontal */
  justify-items: end;      /* Alinha no final horizontal */
  justify-items: center;   /* Centraliza horizontalmente */
  justify-items: stretch;  /* Estica horizontalmente */

  align-items: start;      /* Alinha no início vertical */
  align-items: end;        /* Alinha no final vertical */
  align-items: center;     /* Centraliza verticalmente */
  align-items: stretch;    /* Estica verticalmente */
}
```

### 4.2 Propriedades dos Itens Grid

#### 4.2.1 grid-column e grid-row
```css
.item {
  /* Posicionamento específico */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-column: 1 / 3;      /* Atalho start/end */
  grid-column: 1 / span 2; /* Ocupa 2 colunas */

  grid-row-start: 1;
  grid-row-end: 3;
  grid-row: 1 / 3;         /* Atalho start/end */
  grid-row: 1 / span 2;    /* Ocupa 2 linhas */
}
```

#### 4.2.2 justify-self e align-self
```css
.item {
  /* Alinhamento individual */
  justify-self: start;
  justify-self: end;
  justify-self: center;
  justify-self: stretch;

  align-self: start;
  align-self: end;
  align-self: center;
  align-self: stretch;
}
```

### 4.3 Casos de Uso Avançados

#### Dashboard Responsivo
```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.dashboard-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

#### Layout de Galeria
```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem;
}

.gallery-item:nth-child(4n+1) {
  grid-column: span 2;
  grid-row: span 2;
}
```

### 4.4 Grid vs Flexbox: Quando Usar

#### Flexbox
- Layouts unidimensionais
- Distribuição de espaço
- Alinhamento de conteúdo
- Navegação
- Componentes pequenos

#### Grid
- Layouts bidimensionais
- Layouts complexos
- Alinhamento preciso
- Designs de página inteira
- Layouts assimétricos

### 4.5 Considerações Finais

1. **Combinação de Técnicas**
   - Use Grid para layout geral
   - Use Flexbox para componentes internos
   - Não há problema em aninhar

2. **Compatibilidade**
   - Suporte em navegadores modernos
   - Sempre tenha fallbacks
   - Use feature queries

3. **Performance**
   - Minimize reflows
   - Evite mudanças constantes
   - Prefira transformações

## 5. Transições e Animações

### 5.1 Transições Básicas
```css
.button {
  background-color: blue;
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease;
  
  &:hover {
    background-color: darkblue;
    transform: scale(1.05);
  }
}
```

### 5.2 Keyframes
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-entry {
  animation: 
    fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

## 6. Novos Recursos do CSS (2020-2024)

### 6.1 CSS Variables Avançadas
```css
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  
  /* Tema dinâmico */
  --background: white;
  --text-color: black;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #121212;
    --text-color: #e0e0e0;
  }
}
```

### 6.2 Container Queries
```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### 6.3 Seletores Modernos
```css
/* Nth child avançado */
.list li:nth-child(even):not(.disabled) {
  background-color: #f4f4f4;
}

/* Seletor has() */
.parent:has(> .child) {
  background-color: yellow;
}
```

## 7. Acessibilidade e Performance

### 7.1 Redução de Movimento
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### 7.2 Performance de Animações
```css
.high-performance {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

## 8. Considerações Finais

### 8.1 Boas Práticas
- Use mobile-first
- Priorize performance
- Mantenha código limpo
- Teste em múltiplos dispositivos

### 8.2 Ferramentas
- Chrome DevTools
- Firefox Developer Tools
- Can I Use
- PostCSS
- Stylelint
