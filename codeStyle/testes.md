# 🧪 Guia Avançado de Testes Automatizados

## 🔬 Fundamentos Filosóficos dos Testes

### Princípios Fundamentais
- **Confiabilidade**: Garantir a integridade do software
- **Documentação Viva**: Testes como especificação do comportamento
- **Prevenção de Regressões**: Detectar problemas antes da produção
- **Design Orientado a Testes**: Código testável como princípio arquitetural

## 🧪 Fundamentos Conceituais de Testes de Software

### O Que São Testes de Software?
Testes de software são uma investigação técnica sistemática para verificar se um sistema de software atende aos requisitos especificados e identificar diferenças entre resultados esperados e reais.

### Conceitos Fundamentais de Teste

#### 1. Test Doubles: A Metáfora do Dublê de Ação

##### a) Dummy
Dummy Objects são os "manequins" do mundo dos testes. Eles existem apenas para preencher parâmetros de método, sem realizar qualquer ação significativa.

```typescript
// Dummy: Objeto que não faz nada, apenas preenche um parâmetro
class DummyLogger implements Logger {
  log(message: string) {
    // Não faz nada, só existe para satisfazer a interface
  }
}

function processData(logger: Logger = new DummyLogger()) {
  // Método que precisa de um logger, mas não vai usá-lo
}
```

##### b) Stub
Stubs são objetos pré-programados para retornar respostas específicas durante um teste, permitindo simular diferentes cenários.

```typescript
// Stub: Fornece respostas predefinidas
class UserRepositoryStub implements UserRepository {
  getById(id: string): User {
    // Sempre retorna um usuário pré-definido
    return {
      id: '123',
      name: 'Usuário Teste',
      email: 'teste@exemplo.com'
    };
  }
}
```

##### c) Spy
Spies são objetos que registram informações sobre chamadas de método, permitindo verificar como foram invocados.

```typescript
// Spy: Registra informações sobre chamadas
class EmailServiceSpy implements EmailService {
  private sentEmails: string[] = [];

  send(to: string, message: string): void {
    // Registra cada email enviado
    this.sentEmails.push(to);
  }

  getSentEmailCount(): number {
    return this.sentEmails.length;
  }

  wasEmailSentTo(email: string): boolean {
    return this.sentEmails.includes(email);
  }
}
```

##### d) Mock
Mocks são objetos pré-programados com expectativas específicas, que verificam não apenas o que acontece, mas como acontece.

```typescript
// Mock: Objeto com expectativas predefinidas
class PaymentServiceMock implements PaymentService {
  private expectedPayment: Payment;
  private wasCalled = false;

  expect(payment: Payment) {
    this.expectedPayment = payment;
  }

  process(payment: Payment): boolean {
    this.wasCalled = true;
    return this.validatePayment(payment);
  }

  verify() {
    if (!this.wasCalled) {
      throw new Error('Método não foi chamado');
    }
  }

  private validatePayment(payment: Payment): boolean {
    return JSON.stringify(payment) === JSON.stringify(this.expectedPayment);
  }
}
```

#### 2. Triple A: Anatomia de um Teste Perfeito

##### Arrange-Act-Assert: Contando uma História de Teste

```typescript
describe('Conta Bancária', () => {
  // 🏗️ Arrange: Preparando o Cenário
  it('deve realizar saque com saldo suficiente', () => {
    // Configuração inicial
    const conta = new ContaBancaria(1000);  // Saldo inicial

    // 🚀 Act: Executando a Ação
    const valorSaque = 500;
    conta.sacar(valorSaque);

    // ✅ Assert: Verificando Resultado
    expect(conta.getSaldo()).toBe(500);
  });
});
```

#### 3. MakeSut: Fábrica de Contexto de Teste

##### Conceito
`makeSut` (System Under Test) é uma função que cria o contexto completo para um teste, isolando dependências e preparando o ambiente.

```typescript
function makeSut() {
  // Criação de dependências controladas
  const userRepositoryStub = new UserRepositoryStub();
  const emailServiceSpy = new EmailServiceSpy();
  
  // Sistema sendo testado
  const sut = new UserService(
    userRepositoryStub, 
    emailServiceSpy
  );

  return {
    sut,
    userRepositoryStub,
    emailServiceSpy
  };
}

describe('UserService', () => {
  it('deve criar usuário e enviar email', () => {
    // Usando makeSut para preparar o teste
    const { sut, emailServiceSpy } = makeSut();

    const novoUsuario = sut.criarUsuario({
      nome: 'João',
      email: 'joao@teste.com'
    });

    expect(emailServiceSpy.wasEmailSentTo('joao@teste.com')).toBe(true);
  });
});
```

## 🛠️ Ferramentas e Ecossistema

### Vitest: Testes Unitários e de Integração
```typescript
// Exemplo de Estrutura de Testes
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Teste de Componente
describe('UserForm', () => {
  let mockSubmit: jest.Mock;

  beforeEach(() => {
    mockSubmit = vi.fn();
  });

  it('renderiza corretamente', () => {
    render(<UserForm onSubmit={mockSubmit} />);
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('valida entrada de dados', () => {
    render(<UserForm onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('submete formulário corretamente', () => {
    render(<UserForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Nome'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    });
    
    fireEvent.click(screen.getByText('Enviar'));

    expect(mockSubmit).toHaveBeenCalledWith({
      nome: 'John Doe',
      email: 'john@example.com'
    });
  });
});

// Teste de Lógica de Negócio
describe('Calculadora', () => {
  it('realiza soma corretamente', () => {
    const resultado = calculadora.soma(2, 3);
    expect(resultado).toBe(5);
  });

  it('lida com números negativos', () => {
    const resultado = calculadora.soma(-1, -1);
    expect(resultado).toBe(-2);
  });
});
```

### Playwright: Testes E2E e Interface
```typescript
// Exemplo de Testes End-to-End
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Login com Credenciais Válidas', async ({ page }) => {
    // Preencher formulário
    await page.fill('input[name="email"]', 'usuario@teste.com');
    await page.fill('input[name="senha"]', 'senhaSegura123');
    
    // Clicar no botão
    await page.click('button[type="submit"]');
    
    // Verificações
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('user-greeting')).toBeVisible();
  });

  test('Validação de Campos Obrigatórios', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    // Verificar mensagens de erro
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });

  test('Fluxo Completo de Compra', async ({ page }) => {
    // Login
    await page.login('usuario@teste.com', 'senhaSegura123');
    
    // Navegação e Seleção de Produto
    await page.goto('/produtos');
    await page.click('.produto-destaque');
    await page.click('button:has-text("Adicionar ao Carrinho")');
    
    // Checkout
    await page.goto('/carrinho');
    await page.click('button:has-text("Finalizar Compra")');
    
    // Verificações
    await expect(page).toHaveURL('/confirmacao');
    await expect(page.getByTestId('pedido-sucesso')).toBeVisible();
  });
});
```

## 🏗️ Arquitetura de Testes

### Níveis de Teste
1. **Testes Unitários**: Componentes isolados
2. **Testes de Integração**: Interação entre componentes
3. **Testes End-to-End**: Fluxos completos de usuário

### Estratégias de Cobertura
```typescript
// Configuração de Cobertura
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts'
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 80,
        statements: 80
      }
    }
  }
});
```

## 🚀 Boas Práticas

### Princípios de Teste
- **FIRST**: Fast, Isolated, Repeatable, Self-validating, Timely
- Testes independentes
- Minimizar dependências externas
- Usar mocks e stubs estrategicamente

### Padrões de Escrita
- Nomenclatura clara
- Um cenário por teste
- Testes legíveis e expressivos
- Evitar lógica complexa nos testes

## ⚠️ Pontos de Atenção

### Armadilhas Comuns
- Testes frágeis
- Dependência de estado global
- Testes muito acoplados
- Baixa cobertura

### Otimização
- Paralelização de testes
- Caching de execução
- Seleção inteligente de testes

## 🔬 Métricas de Qualidade
- Cobertura de Código
- Tempo de Execução
- Estabilidade dos Testes
- Número de Falhas

## 📦 Configuração Recomendada

### Estrutura de Diretórios
```
__tests__/
├── unit/
│   ├── components/
│   └── utils/
├── integration/
│   └── services/
└── e2e/
    ├── auth/
    └── checkout/
```

### Dependências
```json
{
  "devDependencies": {
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.38.0",
    "@types/jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0"
  }
}
```

## 🧪 Engenharia Avançada de Testes: Arquitetura e Estratégias Profundas

### Fundamentos Filosóficos dos Testes

#### Princípios Fundamentais da Testabilidade
- **Decomposição**: Sistemas como composição de unidades testáveis
- **Inversão de Dependência**: Desacoplamento para testabilidade
- **Contrato de Comportamento**: Testes como especificação formal
- **Mutabilidade Controlada**: Simulação precisa de estados e comportamentos

### Arquitetura de Testes Unitários e de Integração

#### Taxonomia de Test Doubles

##### 1. Mocks: Objetos de Verificação Comportamental
```typescript
// Exemplo Avançado de Mock
class PaymentServiceMock implements PaymentService {
  private processedPayments: Payment[] = [];
  private failureSimulation = false;

  simulateFailure() {
    this.failureSimulation = true;
  }

  async processPayment(payment: Payment): Promise<PaymentResult> {
    if (this.failureSimulation) {
      throw new PaymentProcessingError('Simulated payment failure');
    }

    this.processedPayments.push(payment);
    return {
      status: 'success',
      transactionId: generateUniqueId()
    };
  }

  getProcessedPayments(): Payment[] {
    return this.processedPayments;
  }

  // Verificações de comportamento
  assertPaymentProcessed(payment: Payment) {
    const found = this.processedPayments.find(p => 
      p.amount === payment.amount && 
      p.customerId === payment.customerId
    );
    if (!found) {
      throw new Error('Payment not processed as expected');
    }
  }
}
```

##### 2. Spies: Observação de Chamadas e Interações
```typescript
// Spy Avançado para Rastreamento Detalhado
class UserServiceSpy {
  private methodCalls: {
    method: string;
    args: any[];
    timestamp: number;
  }[] = [];

  private originalMethod: Function;

  constructor(originalMethod: Function) {
    this.originalMethod = originalMethod;
  }

  wrap() {
    return (...args: any[]) => {
      this.methodCalls.push({
        method: this.originalMethod.name,
        args,
        timestamp: Date.now()
      });

      return this.originalMethod(...args);
    };
  }

  getCallHistory() {
    return this.methodCalls;
  }

  assertCalledWith(...expectedArgs: any[]) {
    const matchingCall = this.methodCalls.find(call => 
      JSON.stringify(call.args) === JSON.stringify(expectedArgs)
    );

    if (!matchingCall) {
      throw new Error('Method not called with expected arguments');
    }
  }

  assertCallCount(expectedCount: number) {
    if (this.methodCalls.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} calls, but got ${this.methodCalls.length}`);
    }
  }
}
```

##### 3. Stubs: Respostas Controladas
```typescript
// Stub Avançado com Comportamento Configurável
class UserRepositoryStub implements UserRepository {
  private users: User[] = [];
  private configuredBehavior: {
    [key: string]: (args: any) => any
  } = {};

  constructor(initialUsers: User[] = []) {
    this.users = initialUsers;
  }

  // Configuração dinâmica de comportamento
  setupBehavior(method: string, handler: (args: any) => any) {
    this.configuredBehavior[method] = handler;
  }

  async findUserById(id: string): Promise<User | null> {
    if (this.configuredBehavior['findUserById']) {
      return this.configuredBehavior['findUserById'](id);
    }

    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (this.configuredBehavior['createUser']) {
      return this.configuredBehavior['createUser'](userData);
    }

    const newUser = {
      id: generateUniqueId(),
      ...userData,
      createdAt: new Date()
    } as User;

    this.users.push(newUser);
    return newUser;
  }
}
```

### Padrão Triple A (Arrange, Act, Assert)
```typescript
// Exemplo Completo de Teste com Triple A
describe('UserService', () => {
  // Função makeSut para criação de contexto de teste
  function makeSut() {
    const userRepositoryStub = new UserRepositoryStub();
    const paymentServiceMock = new PaymentServiceMock();
    const sut = new UserService(userRepositoryStub, paymentServiceMock);

    return {
      sut,
      userRepositoryStub,
      paymentServiceMock
    };
  }

  it('deve criar usuário premium com pagamento', async () => {
    // Arrange
    const { 
      sut, 
      userRepositoryStub, 
      paymentServiceMock 
    } = makeSut();

    userRepositoryStub.setupBehavior('findUserById', () => null);

    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'premium'
    };

    // Act
    const result = await sut.createPremiumUser(userData);

    // Assert
    expect(result.user.plan).toBe('premium');
    paymentServiceMock.assertPaymentProcessed({
      amount: PREMIUM_PLAN_PRICE,
      customerId: result.user.id
    });
    
    // Verificações adicionais
    expect(result.user.createdAt).toBeDefined();
    expect(result.user.id).toBeTruthy();
  });

  it('deve lançar erro ao criar usuário com email existente', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut();

    userRepositoryStub.setupBehavior('findUserById', () => ({
      id: 'existing-user-id',
      email: 'john@example.com'
    }));

    // Act & Assert
    await expect(
      sut.createPremiumUser({
        name: 'John Doe',
        email: 'john@example.com',
        plan: 'premium'
      })
    ).rejects.toThrow('User already exists');
  });
});
```

### Estratégias Avançadas de Teste

#### Técnicas de Isolamento
- Injeção de Dependências
- Princípio da Responsabilidade Única
- Minimização de Acoplamento
- Abstrações Testáveis

#### Padrões de Projeto para Testabilidade
- Factory Method
- Strategy Pattern
- Dependency Injection
- Adapter Pattern

## 🚀 Princípios Arquiteturais

### Níveis de Teste
1. **Unitário**: Componentes isolados
2. **Integração**: Interação entre componentes
3. **Contrato**: Verificação de interfaces

### Métricas de Qualidade
- Cobertura de Código
- Complexidade Ciclomática
- Mutação de Teste
- Tempo de Execução

## ⚠️ Pontos de Atenção

### Anti-Padrões
- Testes Frágeis
- Dependência de Implementação
- Testes Não Determinísticos
- Excesso de Mocks

### Boas Práticas
- Testes Independentes
- Nomenclatura Clara
- Um Cenário por Teste
- Minimizar Lógica nos Testes

**Última Atualização**: {{ data_atual }}
**Versão**: 2.0 - Engenharia Avançada de Testes
