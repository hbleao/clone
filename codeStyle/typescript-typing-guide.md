# Guia de Padronização de Tipagem em TypeScript

## 1. Princípios Gerais de Tipagem

### 1.1 Preferência por Tipos Explícitos
- Sempre que possível, defina tipos explicitamente
- Evite `any` em qualquer circunstância

```typescript
// Ruim
let data = any;

// Bom
let data: string | number;
```

## 2. Tipagem de Variáveis

### 2.1 Constantes
- Use `const` para valores que não mudam
- Defina o tipo explicitamente quando necessário

```typescript
const MAX_USERS = 100;
const API_ENDPOINT: string = 'https://api.example.com';
```

### 2.2 Variáveis Mutáveis
- Use `let`
- Defina tipos precisos

```typescript
let userName: string;
let userAge: number;
let isActive: boolean;
```

## 3. Tipagem de Funções

### 3.1 Assinatura de Funções
- Defina tipos de parâmetros e retorno
- Use tipos descritivos e precisos

```typescript
// Função com tipos explícitos
function calculateTotal(
  price: number, 
  quantity: number
): number {
  return price * quantity;
}

// Arrow function
const getUserName = (id: string): string => {
  // Implementação
};
```

### 3.2 Funções Assíncronas
- Use `Promise<T>` para funções assíncronas
- Defina o tipo de retorno da Promise

```typescript
async function fetchUser(
  userId: string
): Promise<User> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
```

## 4. Interfaces e Types

### 4.1 Interfaces para Objetos
- Use interfaces para definir estruturas de objetos
- Prefira interfaces a type aliases para objetos

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Propriedade opcional
}

const createUser = (user: User): void => {
  // Implementação
};
```

### 4.2 Type Aliases
- Use para união de tipos e tipos complexos

```typescript
type Status = 'active' | 'inactive' | 'pending';
type NumberOrString = number | string;
```

## 5. Generics

### 5.1 Funções Genéricas
- Use generics para aumentar a reutilização de código
- Defina constraints quando necessário

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Com constraint
function getProperty<T, K extends keyof T>(
  obj: T, 
  key: K
): T[K] {
  return obj[key];
}
```

## 6. Arrays e Coleções

### 6.1 Tipagem de Arrays
- Use notação de tipo ou generic

```typescript
// Duas formas equivalentes
const numbers: number[] = [1, 2, 3];
const users: Array<User> = [];
```

## 7. Enums

### 7.1 Definição de Enums
- Use para conjuntos de constantes relacionadas

```typescript
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}
```

## 8. Melhores Práticas

### 8.1 Evite
- Uso de `any`
- Tipos muito genéricos
- Omissão de tipos em funções públicas

### 8.2 Prefira
- Tipos específicos e descritivos
- Interfaces bem definidas
- Generics quando apropriado

## 9. Exemplos Completos

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

type UserStatus = 'active' | 'inactive' | 'suspended';

interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}

class UserService {
  async fetchUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch('/api/users');
      return {
        data: await response.json(),
        status: response.status
      };
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  createUser(userData: Omit<User, 'id'>): Promise<User> {
    // Implementação
  }
}
```

## 10. Ferramentas e Configuração

### 10.1 Configurações do tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 11. Variáveis Globais

### 11.1 Quando Usar Variáveis Globais

#### Casos de Uso Aceitáveis
- Configurações de ambiente
- Constantes compartilhadas em toda a aplicação
- Estados globais de baixa mutabilidade
- Configurações de bibliotecas ou frameworks

#### Casos a Evitar
- Armazenamento de estados mutáveis frequentemente alterados
- Substituição de gerenciamento de estado adequado
- Compartilhamento excessivo de dados entre módulos

### 11.2 Padrões de Definição

#### Namespace Global
```typescript
// global.d.ts
declare global {
  interface Window {
    // Extensões específicas para o navegador
    ENV: {
      API_URL: string;
      DEBUG_MODE: boolean;
    };
  }
}
```

#### Módulo de Configurações Globais
```typescript
// config.ts
export const GlobalConfig = {
  APP_NAME: 'Minha Aplicação',
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_LOCALE: 'pt-BR',
  
  // Métodos utilitários globais
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
} as const;
```

### 11.3 Gerenciamento de Estado Global

#### Alternativas Recomendadas
- Redux
- MobX
- Context API do React
- Zustand
- Signals (frameworks modernos)

```typescript
// Exemplo com Context API
interface GlobalState {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
}

const GlobalContext = React.createContext<GlobalState>({
  user: null,
  theme: 'light',
  language: 'pt-BR'
});
```

### 11.4 Variáveis de Ambiente

#### Definição Segura
```typescript
// .env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_API_URL: string;
    NEXT_PUBLIC_ANALYTICS_ID?: string;
  }
}
```

### 11.5 Melhores Práticas

1. **Imutabilidade**
   - Use `as const` para congelar objetos globais
   - Prefira objetos readonly

2. **Tipagem Estrita**
   - Defina interfaces precisas
   - Evite `any` em variáveis globais

3. **Escopo e Visibilidade**
   - Limite o escopo de variáveis globais
   - Use módulos para encapsulamento

4. **Segurança**
   - Não armazene dados sensíveis
   - Evite expor informações críticas

### 11.6 Exemplo Completo

```typescript
// globalTypes.ts
export interface AppSettings {
  readonly theme: 'light' | 'dark';
  readonly maxConcurrentRequests: number;
  readonly supportedLanguages: ReadonlyArray<string>;
}

// globalConfig.ts
export const AppConfig: AppSettings = {
  theme: 'light',
  maxConcurrentRequests: 5,
  supportedLanguages: ['pt-BR', 'en-US', 'es-ES']
} as const;

// usage
import { AppConfig } from './globalConfig';

function initializeApp() {
  const currentTheme = AppConfig.theme;
  // Lógica de inicialização
}
```

### 11.7 Considerações Finais

- Use variáveis globais com moderação
- Priorize modularidade
- Mantenha a tipagem estrita
- Documente o propósito de variáveis globais

## 12. Declaração de Tipos para APIs

### 12.1 Módulo de Tipos Centralizado

Criamos um módulo centralizado `api-types.d.ts` para padronizar todos os tipos de respostas de API. 

#### Benefícios
- Tipagem consistente
- Reutilização de tipos
- Facilita manutenção
- Documentação automática

### 12.2 Estrutura do Módulo

```typescript
// Importação em qualquer serviço ou componente
import { 
  UserProfile, 
  ApiResponse, 
  ProductDetails 
} from './api-types';

// Exemplo de uso
async function fetchUserProfile(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
```

### 12.3 Padrões de Resposta

1. **ApiResponse**: Envelope padrão para todas as respostas
2. **PaginatedResponse**: Para listagens com paginação
3. **Tipos específicos**: UserProfile, ProductDetails, etc.

### 12.4 Boas Práticas

- Mantenha os tipos genéricos e reutilizáveis
- Use interfaces em vez de type aliases para objetos
- Documente tipos complexos
- Utilize type guards para validação

### 12.5 Exemplo de Implementação

```typescript
// No seu serviço de API
import { ApiResponse, UserProfile } from './api-types';

class UserService {
  async getProfile(
    userId: string
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.apiClient.get(`/users/${userId}`);
      
      // Validação de tipo
      if (!isApiResponse<UserProfile>(response)) {
        throw new Error('Invalid API response');
      }
      
      return response;
    } catch (error) {
      // Tratamento de erro padronizado
      return {
        data: null,
        success: false,
        status: error.status || 500,
        message: error.message
      };
    }
  }
}
```

### 12.6 Considerações Finais

- Centralize a definição de tipos
- Mantenha os tipos atualizados
- Use como documentação viva da API

## Interface vs Type: Escolha no Frontend

### Fundamentos da Escolha

#### Por que Preferir `interface`?

1. **Extensibilidade**
```typescript
// Interface permite extensão direta
interface User {
  id: string;
  name: string;
}

// Fácil extensão
interface AdminUser extends User {
  permissions: string[];
}

// Type requer interseção
type UserType = {
  id: string;
  name: string;
};

type AdminUserType = UserType & {
  permissions: string[];
};
```

2. **Merge de Declarações**
```typescript
// Interfaces podem ser declaradas múltiplas vezes
interface Config {
  theme: string;
}

interface Config {
  language: string;
}

// Resultado: Config com theme e language
const config: Config = {
  theme: 'dark',
  language: 'pt-BR'
};

// Type não permite este merge
```

3. **Performance em Tempo de Compilação**
- Interfaces são mais leves para o compilador
- Melhor desempenho em verificações de tipo
- Mensagens de erro mais claras

### Casos para Usar `type`

#### Situações Específicas
- União de tipos
- Tipos primitivos
- Tuplas
- Tipos computados

```typescript
// União de tipos
type Status = 'active' | 'inactive';

// Tupla
type Coordinates = [number, number];

// Tipo computado
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};
```

### Regra Geral no Frontend

#### Preferência em Diferentes Contextos

1. **Componentes React**
```typescript
// Prefira interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false 
}) => { ... };
```

2. **Modelos de Dados**
```typescript
// Interface para modelos
interface User {
  id: string;
  name: string;
  email: string;
}

// Serviços e hooks
function useUserData(userId: string): User | null { ... }
```

3. **Props e Estados**
```typescript
interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

interface FormProps {
  initialValues?: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}
```

### Exceções e Flexibilidade

#### Quando Usar `type`
- Tipos complexos de união
- Mapeamentos de tipos
- Tipos gerados dinamicamente

### Boas Práticas

1. Padrão: Use `interface`
2. Troque para `type` quando necessário
3. Seja consistente no projeto
4. Documente decisões de tipagem

### Considerações Finais

- `interface` é mais flexível para objetos
- `type` para casos específicos
- Priorize legibilidade e manutenção
- Consulte a equipe em caso de dúvida

## Conclusão
- Seja consistente
- Priorize clareza e precisão
- Mantenha a tipagem estrita
