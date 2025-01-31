# 🏗️ Arquitetura de Nomenclatura: Engenharia Semântica de Código

## 🔬 Fundamentos Filosóficos da Nomenclatura

### Princípios Fundamentais
- **Código como Comunicação**: Nomenclatura não é apenas sintaxe, é narrativa
- **Semântica Intencional**: Cada nome deve revelar propósito e contexto
- **Abstração Inteligente**: Nomes que transcendem implementações específicas

## 📊 Taxonomia de Nomenclatura

### 🔤 Níveis de Nomenclatura

#### Nível 1: Identificadores Básicos
- Variáveis de escopo local
- Parâmetros de funções simples
```typescript
const age: number = 30;
function calculate(value: number) { ... }
```

#### Nível 2: Componentes de Domínio
- Entidades de negócio
- Serviços de contexto específico
```typescript
interface CustomerSubscription {
  tier: SubscriptionTier;
  billingCycle: BillingFrequency;
}

class PaymentProcessorService {
  private transactionValidator: TransactionValidator;
}
```

#### Nível 3: Arquitetura de Sistemas
- Abstrações de alto nível
- Padrões de design complexos
```typescript
interface IResilienceStrategy<T> {
  retry(operation: () => Promise<T>): Promise<T>;
  circuitBreak(threshold: number): void;
}

type DomainEventHandler<E extends DomainEvent> = (event: E) => Promise<void>;
```

## 🏗️ Nomenclatura em Escopos Complexos: Arquitetura de Nomeação

### 🌐 Princípios Fundamentais de Nomenclatura

#### Filosofia de Nomeação
- **Clareza**: Nome deve revelar intenção
- **Contexto**: Nome deve carregar significado do escopo
- **Granularidade**: Níveis de detalhamento conforme complexidade

### 📊 Taxonomia de Nomenclatura por Escopo

#### 1. Escopo Global
```typescript
// ❌ Ruim
let x = 10;
const y = 'user';

// ✅ Bom
const GLOBAL_MAX_CONNECTIONS = 10;
const DEFAULT_USER_ROLE = 'guest';
```

#### 2. Escopo de Módulo
```typescript
// Padrão: [dominio][Tipo][Descritor]
// Exemplos
export interface UserRepositoryInterface {}
export class UserServiceManager {}
export type UserDataTransferObject = {}
```

#### 3. Escopo de Classe
```typescript
class PaymentProcessor {
  // Prefixos de Visibilidade
  private _internalState: string;        // Privado
  protected _protectedHelper: number;    // Protegido
  public primaryMethod: () => void;      // Público

  // Métodos com Prefixos Semânticos
  private _validatePayment() {}           // Validação interna
  public processPayment() {}              // Ação principal
  protected calculateTotalAmount() {}     // Cálculo auxiliar
}
```

#### 4. Escopo de Função
```typescript
// Padrão: [verbo][Substantivo][Modificador]
function createUserAccount(userData: UserData): User {
  // Variáveis com contexto
  const sanitizedUserData = sanitizeInput(userData);
  const newUserInstance = new User(sanitizedUserData);
  
  return newUserInstance;
}

// Funções Assíncronas
async function fetchUserProfileWithRetry(
  userId: string, 
  retryCount: number = 3
): Promise<UserProfile> {
  // Lógica com tratamento de retry
}
```

#### 5. Escopo de Closure e Callbacks
```typescript
// Nomenclatura Contextual em Callbacks
const processUserData = (
  userData: UserData, 
  onSuccess: (processedUser: User) => void,
  onError: (error: Error) => void
) => {
  try {
    const processedUser = transformUserData(userData);
    onSuccess(processedUser);
  } catch (error) {
    onError(new Error('Falha no processamento'));
  }
};

// Closures com Prefixos Semânticos
const createUserManager = (initialUsers: User[]) => {
  let _users = [...initialUsers];
  
  const addUser = (newUser: User) => {
    _users.push(newUser);
  };
  
  const getUserCount = () => _users.length;
  
  return {
    addUser,
    getUserCount
  };
};
```

#### 6. Escopos de Tipos Genéricos
```typescript
// Convenções para Generics
interface Repository<TEntity> {
  findById(id: string): TEntity | null;
  create(entity: TEntity): TEntity;
}

// Generics com Prefixos Semânticos
type QueryResult<TData> = {
  data: TData[];
  total: number;
  error?: string;
};

function executeQuery<TModel>(
  query: string, 
  params: Record<string, unknown>
): QueryResult<TModel> {
  // Implementação
}
```

### 🔍 Estratégias Avançadas

#### Prefixos Semânticos
- `is`: Booleanos
- `has`: Verificações de estado
- `can`: Permissões
- `get`: Recuperação
- `set`: Atribuição
- `create`: Construção
- `update`: Modificação
- `delete`: Remoção

#### Anti-Padrões de Nomenclatura
- Nomes muito curtos
- Abreviações obscuras
- Nomes genéricos
- Nomes que mentem sobre a intenção

### 📋 Checklist de Nomenclatura

1. O nome revela a intenção?
2. É legível sem comentários?
3. Segue o contexto do domínio?
4. Evita abreviações desnecessárias?
5. Mantém consistência com o restante do código?

### 🚨 Pontos de Atenção

- Nomenclatura não substitui documentação
- Mantenha consistência no projeto
- Revisar e refatorar nomes periodicamente
- Documentar convenções específicas do projeto

## 🧠 Estratégias Avançadas

### Prefixos Semânticos
- `I`: Interfaces
- `T`: Types genéricos
- `E`: Enums
- `Abstract`: Classes abstratas
- `Base`: Classes base

```typescript
interface IPaymentGateway { ... }
type TTransactionResult = { ... };
enum EPaymentStatus { ... }
abstract class AbstractRepository { ... }
```

### Anti-Padrões de Nomenclatura

#### 🚫 Proibido
- Nomes genéricos: `data`, `info`, `obj`
- Abreviações não padronizadas
- Nomes que não revelam intenção

#### ✅ Recomendado
- `customerSubscriptionRepository`
- `validatePaymentTransaction()`
- `processRecurringBillingCycle()`

## 🔒 Políticas de Nomenclatura

### Regras Rígidas
1. **Consistência Absoluta**
2. **Contexto Explícito**
3. **Comprimento Significativo**
4. **Independência de Implementação**

### Exemplos Arquiteturais

```typescript
// Ruim
class X { 
  do(y: any) { ... } 
}

// Excelente
class CustomerSubscriptionManager {
  processSubscriptionRenewal(subscriptionId: SubscriptionIdentifier): SubscriptionRenewalResult {
    // Implementação clara e semântica
  }
}
```

## 🤖 Automação e Validação

### Ferramentas de Enforcement
- Linter com regras customizadas
- Análise estática de código
- Git Hooks para validação de nomenclatura

### Métricas de Qualidade
- Complexidade Cognitiva dos Nomes
- Índice de Clareza Semântica
- Consistência de Padrões

## 🔍 Casos Especiais

### Genéricos e Templates
```typescript
function createRepository<
  TEntity, 
  TIdentifier extends Identifier<TEntity>
>(entity: TEntity): IRepository<TEntity, TIdentifier> { ... }
```

### Tratamento de Exceções
```typescript
class DomainValidationError extends Error {
  constructor(
    public readonly context: string, 
    public readonly violations: ValidationViolation[]
  ) {
    super(`Domain Validation Failed: ${context}`);
  }
}
```

## 📚 Guia de Referência Rápida

### Convenções por Tipo
- **Variáveis**: camelCase, substantivos
- **Funções**: camelCase, verbos
- **Classes**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces**: IPascalCase
- **Generics**: TPascalCase

## 🚀 Evolução Contínua

### Processo de Atualização
1. Revisões trimestrais
2. Feedback da equipe
3. Análise de métricas
4. Adaptação incremental

**Última Atualização**: {{ data_atual }}
**Versão**: 3.0 - Nomenclatura em Escopos Complexos
