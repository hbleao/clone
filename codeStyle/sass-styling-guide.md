# Guia de Estilo e Desenvolvimento Web com Sass

## 1. Configuração de Variáveis Globais

### 1.1 Estrutura no next.config.mjs

```javascript
const nextConfig = {
  sassOptions: {
    additionalData: `
      @use "sass:math";
      @use "sass:color";
      
      // Variáveis de Design
      $primary-color: #3498db;
      $secondary-color: #2ecc71;
      $text-color: #333333;
      
      // Breakpoints
      $breakpoint-mobile: 375px;
      $breakpoint-tablet: 768px;
      $breakpoint-desktop: 1024px;
      $breakpoint-large: 1440px;
      
      // Espaçamentos
      $spacing-xs: 0.5rem;
      $spacing-sm: 1rem;
      $spacing-md: 1.5rem;
      $spacing-lg: 2rem;
      
      // Tipografia
      $font-size-base: 16px;
      $font-family-primary: 'Inter', sans-serif;
      $font-weight-light: 300;
      $font-weight-regular: 400;
      $font-weight-bold: 700;
    `
  }
}
```

## 2. Metodologia Mobile-First

### 2.1 Princípios Fundamentais
- Inicie o design para dispositivos móveis
- Use media queries para expandir para telas maiores
- Priorize performance e experiência em dispositivos menores

### 2.2 Exemplo de Implementação

```scss
// Estilo base (mobile)
.container {
  width: 100%;
  padding: $spacing-sm;
  
  // Tablet
  @media (min-width: $breakpoint-tablet) {
    padding: $spacing-md;
    max-width: 720px;
    margin: 0 auto;
  }
  
  // Desktop
  @media (min-width: $breakpoint-desktop) {
    max-width: 1140px;
    padding: $spacing-lg;
  }
}
```

## 3. Estrutura de Módulos Sass

### 3.1 Organização de Arquivos
```
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _global.scss
├── components/
│   ├── _buttons.scss
│   ├── _forms.scss
│   └── _cards.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── _grid.scss
└── pages/
    ├── _home.scss
    ├── _login.scss
    └── _dashboard.scss
```

## 4. Mixins Reutilizáveis

```scss
// Mixins úteis
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive-font-size($mobile, $tablet, $desktop) {
  font-size: $mobile;
  
  @media (min-width: $breakpoint-tablet) {
    font-size: $tablet;
  }
  
  @media (min-width: $breakpoint-desktop) {
    font-size: $desktop;
  }
}

@mixin hover-effect {
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

## 5. Boas Práticas com Sass Modules

### 5.1 Importação e Uso
```scss
@use "sass:math";
@use "./abstracts/variables" as var;
@use "./abstracts/mixins" as mix;

.button {
  background-color: var.$primary-color;
  padding: var.$spacing-sm var.$spacing-md;
  
  @include mix.flex-center;
  @include mix.hover-effect;
  
  @include mix.responsive-font-size(
    14px,   // Mobile
    16px,   // Tablet
    18px    // Desktop
  );
}
```

## 6. Responsividade Avançada

### 6.1 Funções de Conversão
```scss
@function calculate-fluid-font-size(
  $min-size, 
  $max-size, 
  $min-width, 
  $max-width
) {
  $slope: math.div($max-size - $min-size, $max-width - $min-width);
  $base-intersection: -$min-width * $slope + $min-size;
  
  @return clamp(
    #{$min-size}, 
    #{$base-intersection} + #{$slope * 100}vw, 
    #{$max-size}
  );
}

// Uso
.title {
  font-size: calculate-fluid-font-size(
    18px,   // Tamanho mínimo
    24px,   // Tamanho máximo
    375px,  // Largura mínima
    1440px  // Largura máxima
  );
}
```

## 7. Considerações Finais

### 7.1 Princípios
- Mantenha o código DRY (Don't Repeat Yourself)
- Use variáveis para consistência
- Priorize legibilidade
- Minimize especificidade
- Teste em múltiplos dispositivos

## 8. Performance

### 8.1 Otimização
- Minimize o uso de aninhamento profundo
- Evite seletores muito específicos
- Use `@extend` com moderação
- Prefira classes a IDs

## 9. Acessibilidade

### 9.1 Diretrizes
- Mantenha contraste adequado
- Use unidades relativas (rem, em)
- Considere modo de alto contraste
- Suporte zoom e tamanho de fonte

## 10. Ferramentas Recomendadas
- Stylelint
- PurgeCSS
- PostCSS
- Sass Lint

## 11. Guia Completo de Sass: Mixins, Funções e Técnicas Avançadas

## 12. Mixins: Reutilização de Estilos

### 12.1 Conceitos Básicos de Mixins

#### Definição Simples
```scss
// Mixin básico
@mixin button-base {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s ease;
}

// Uso do mixin
.primary-button {
  @include button-base;
  background-color: #3498db;
  color: white;
}
```

### 12.2 Mixins com Parâmetros
```scss
// Mixin com parâmetros
@mixin flex-center($direction: row, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// Uso com parâmetros padrão
.container {
  @include flex-center(); // Centralizado padrão
}

// Uso com parâmetros personalizados
.sidebar {
  @include flex-center(column, flex-start, stretch);
}
```

### 12.3 Mixins Condicionais
```scss
// Mixin com lógica condicional
@mixin responsive-font($size, $mobile-size: null) {
  font-size: $size;
  
  @if $mobile-size {
    @media (max-width: 768px) {
      font-size: $mobile-size;
    }
  }
}

// Uso
h1 {
  @include responsive-font(2rem, 1.5rem);
}
```

### 12.4 Mixins para Media Queries
```scss
// Mixin de media queries
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 576px) { @content; }
  }
  @else if $breakpoint == tablet {
    @media (min-width: 577px) and (max-width: 992px) { @content; }
  }
  @else if $breakpoint == desktop {
    @media (min-width: 993px) { @content; }
  }
}

// Uso
.card {
  width: 100%;
  
  @include respond-to(tablet) {
    width: 50%;
  }
  
  @include respond-to(desktop) {
    width: 33.33%;
  }
}
```

### 12.5 Mixins de Transformação
```scss
// Mixin de transformação
@mixin transform($property...) {
  -webkit-transform: $property;
  -moz-transform: $property;
  -ms-transform: $property;
  -o-transform: $property;
  transform: $property;
}

// Uso
.animated-element {
  @include transform(rotate(45deg) scale(1.2));
}
```

## 13. Funções Sass Avançadas

### 13.1 Funções Matemáticas
```scss
// Função para calcular porcentagem
@function calculate-width($target, $container) {
  @return percentage($target / $container);
}

// Uso
.sidebar {
  width: calculate-width(300px, 1200px); // 25%
}
```

### 13.2 Funções de Cor
```scss
// Função para ajustar brilho
@function adjust-brightness($color, $amount) {
  @return mix(white, $color, $amount);
}

// Função para gerar variações de cor
@function color-variant($base-color, $variation: 10%) {
  @return mix(white, $base-color, $variation);
}

// Uso
.button {
  background-color: #3498db;
  
  &:hover {
    background-color: color-variant(#3498db, 20%);
  }
}
```

### 13.3 Funções de Lista
```scss
// Função para pegar último elemento
@function last($list) {
  @return nth($list, length($list));
}

// Função para remover item de lista
@function remove($list, $value) {
  $result: ();
  @each $item in $list {
    @if $item != $value {
      $result: append($result, $item);
    }
  }
  @return $result;
}

// Uso
$colors: red, green, blue, yellow;
$new-colors: remove($colors, green);
```

## 14. Mixins Úteis para Projetos

### 14.1 Mixin de Responsividade
```scss
@mixin responsive($property, $mobile-value, $desktop-value) {
  #{$property}: $mobile-value;
  
  @media (min-width: 768px) {
    #{$property}: $desktop-value;
  }
}

// Uso
.container {
  @include responsive(padding, 10px, 20px);
  @include responsive(font-size, 14px, 16px);
}
```

### 14.2 Mixin de Gradiente
```scss
@mixin gradient($start-color, $end-color, $direction: to right) {
  background: linear-gradient($direction, $start-color, $end-color);
}

// Uso
.card {
  @include gradient(#3494e6, #ec6ead);
}
```

### 14.3 Mixin de Sombra
```scss
@mixin box-shadow($level: 1) {
  @if $level == 1 {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }
  @else if $level == 2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
  @else if $level == 3 {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
}

// Uso
.card {
  @include box-shadow(2);
}
```

### 14.4 Mixin de Texto Truncado
```scss
@mixin text-truncate($width: 100%) {
  width: $width;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Uso
.card-title {
  @include text-truncate(250px);
}
```

### 14.5 Mixin de Animação
```scss
@mixin keyframes($name) {
  @-webkit-keyframes #{$name} { @content; }
  @-moz-keyframes #{$name} { @content; }
  @-o-keyframes #{$name} { @content; }
  @keyframes #{$name} { @content; }
}

@mixin animation($str) {
  -webkit-animation: #{$str};
  -moz-animation: #{$str};
  -o-animation: #{$str};
  animation: #{$str};
}

// Definição
@include keyframes(slide-in) {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

// Uso
.animated-element {
  @include animation('slide-in 0.5s ease forwards');
}
```

## 15. Boas Práticas

### 15.1 Dicas para Mixins
- Mantenha mixins simples e focados
- Use parâmetros com valores padrão
- Evite mixins muito complexos
- Documente o propósito do mixin

### 15.2 Performance
- Mixins geram código CSS repetido
- Use com moderação
- Prefira herança quando possível
- Considere usar funções para lógica

### 15.3 Organização
- Agrupe mixins relacionados
- Use arquivos separados para mixins complexos
- Mantenha nomenclatura consistente

## 16. Considerações Finais

1. Mixins são poderosos
2. Use com responsabilidade
3. Priorize legibilidade
4. Mantenha-se atualizado
5. Pratique constantemente
