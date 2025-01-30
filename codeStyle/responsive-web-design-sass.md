# Guia Definitivo de Web Design Responsivo com Sass

## 1. Fundamentos de Responsividade

### 1.1 Princípios Mobile-First
```scss
// Variáveis de breakpoints
$breakpoints: (
  mobile: 375px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px
);

// Mixin de media query
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Breakpoint inexistente: #{$breakpoint}";
  }
}
```

### 1.2 Viewport e Unidades Responsivas
```scss
// Reset responsivo
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px; // Base para rem
  
  @include respond-to(tablet) {
    font-size: 18px;
  }
  
  @include respond-to(desktop) {
    font-size: 20px;
  }
}

// Unidades fluidas
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

## 2. Grid Responsivo com Sass

### 2.1 Sistema de Grid Flexível
```scss
// Variáveis de grid
$grid-columns: 12;
$grid-gutter: 1rem;

// Mixin de coluna
@mixin column($span) {
  width: percentage($span / $grid-columns);
  padding: 0 ($grid-gutter / 2);
  float: left;
}

// Mixin de linha
@mixin row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 (-$grid-gutter / 2);
  
  &::after {
    content: "";
    clear: both;
    display: table;
  }
}

// Exemplo de uso
.row {
  @include row;
}

.col-4 {
  @include column(4);
  
  @include respond-to(mobile) {
    @include column(12);
  }
}
```

## 3. Tipografia Responsiva

### 3.1 Escalamento Fluido
```scss
// Função de clamp
@function fluid-type($min-vw, $max-vw, $min-font-size, $max-font-size) {
  $u1: unit($min-vw);
  $u2: unit($max-vw);
  $u3: unit($min-font-size);
  $u4: unit($max-font-size);

  @if $u1 == $u2 and $u3 == $u4 {
    $slope: ($max-font-size - $min-font-size) / ($max-vw - $min-vw);
    $intersection: -$min-vw * $slope + $min-font-size;
    @return clamp(#{$min-font-size}, #{$intersection} + #{$slope * 100}vw, #{$max-font-size});
  }
  
  @error 'Unidades incompatíveis';
}

// Aplicação
body {
  font-size: fluid-type(320px, 1200px, 16px, 22px);
}

h1 {
  font-size: fluid-type(320px, 1200px, 24px, 48px);
  line-height: 1.2;
}
```

## 4. Flexbox Responsivo

### 4.1 Layouts Adaptativos
```scss
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  @include respond-to(mobile) {
    flex-direction: column;
  }
  
  @include respond-to(desktop) {
    flex-direction: row;
  }
}

.flex-item {
  flex: 1 1 calc(33.333% - 1rem);
  min-width: 250px;
  
  @include respond-to(mobile) {
    flex-basis: 100%;
  }
}
```

## 5. Imagens Responsivas

### 5.1 Técnicas de Responsividade
```scss
.responsive-image {
  max-width: 100%;
  height: auto;
  
  // Imagem de fundo responsiva
  &.bg-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}

// Picture element com múltiplas fontes
@mixin responsive-picture($mobile-img, $desktop-img) {
  picture {
    source {
      &[media="(max-width: 767px)"] {
        srcset: $mobile-img;
      }
      
      &[media="(min-width: 768px)"] {
        srcset: $desktop-img;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
```

## 6. Técnicas Avançadas

### 6.1 Container Queries
```scss
@supports (container-type: inline-size) {
  .card-container {
    container-type: inline-size;
  }
  
  @container (min-width: 400px) {
    .card {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
}
```

## 7. Performance e Otimização

### 7.1 Técnicas de Carregamento
```scss
// Lazy loading de imagens
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &.loaded {
    opacity: 1;
  }
}

// Redução de reflow
.minimal-reflow {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

## 8. Acessibilidade Responsiva

### 8.1 Considerações de Design
```scss
// Contraste e legibilidade
@mixin high-contrast {
  @media (prefers-contrast: high) {
    @content;
  }
}

// Redução de movimento
@mixin reduce-motion {
  @media (prefers-reduced-motion: reduce) {
    @content;
  }
}

body {
  @include high-contrast {
    color: #000;
    background-color: #fff;
  }
  
  @include reduce-motion {
    transition: none !important;
    animation: none !important;
  }
}
```

## 9. Considerações Finais

### 9.1 Boas Práticas
- Sempre teste em múltiplos dispositivos
- Use ferramentas de desenvolvimento
- Priorize performance
- Mantenha o design simples
- Foque na experiência do usuário

### 9.2 Ferramentas de Teste
- Chrome DevTools
- Firefox Responsive Design Mode
- BrowserStack
- Lighthouse
- WebPageTest

## 10. Recursos Adicionais
- MDN Web Docs
- CSS-Tricks
- Web.dev
- Sass Documentation
