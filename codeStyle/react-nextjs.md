# 🚀 Arquitetura de Componentes: React & Next.js

## 🏗️ Fundamentos Arquiteturais

### Princípios Filosóficos
- **Componentes como Unidades de Negócio**
- **Composição sobre Herança**
- **Imutabilidade e Previsibilidade**
- **Separação de Responsabilidades**

## 📊 Taxonomia de Componentes

### 🔬 Níveis de Componentização

#### Nível 1: Componentes Atômicos
```typescript
// Componente Primitivo
const Typography: React.FC<{
  variant?: 'title' | 'body' | 'caption';
  weight?: 'light' | 'regular' | 'bold';
}> = ({ children, variant = 'body', weight = 'regular' }) => {
  return (
    <span 
      className={`typography typography--${variant} typography--${weight}`}
    >
      {children}
    </span>
  );
};
```

#### Nível 2: Componentes Moleculares
```typescript
// Componente Composto
const UserCard: React.FC<{
  user: User;
  actions?: React.ReactNode;
}> = ({ user, actions }) => {
  return (
    <Card>
      <Avatar src={user.avatarUrl} />
      <Typography variant="title">{user.name}</Typography>
      <Typography variant="caption">{user.email}</Typography>
      {actions}
    </Card>
  );
};
```

#### Nível 3: Componentes de Domínio
```typescript
// Componente de Domínio Complexo
const SubscriptionManager: React.FC<{
  customerId: string;
}> = ({ customerId }) => {
  const { data: subscriptions, isLoading } = useSubscriptions(customerId);
  
  return (
    <DomainSection>
      <SubscriptionList 
        items={subscriptions} 
        loading={isLoading}
      />
      <UpgradeSection customerId={customerId} />
    </DomainSection>
  );
};
```

## 🧠 Estratégias Avançadas

### Gerenciamento de Estado

#### Hooks Customizados
```typescript
// Hook de Gerenciamento de Estado Complexo
function useOptimisticUpdate<T>(
  initialState: T, 
  updateFn: (current: T) => T
) {
  const [state, setState] = useState(initialState);
  const [optimisticState, setOptimisticState] = useState(initialState);

  const commit = useCallback(() => {
    setState(optimisticState);
  }, [optimisticState]);

  const rollback = useCallback(() => {
    setOptimisticState(state);
  }, [state]);

  return {
    state: optimisticState,
    commit,
    rollback,
    update: (updater: (current: T) => T) => {
      setOptimisticState(updater);
    }
  };
}
```

### Server Components & Server Actions
```typescript
// Exemplo de Server Component
async function ProductCatalog() {
  const products = await fetchProducts();
  
  return (
    <ServerComponent>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </ServerComponent>
  );
}

// Server Action
'use server'
async function updateProductStock(
  productId: string, 
  quantity: number
) {
  const result = await ProductService.updateStock(productId, quantity);
  
  return {
    success: result.status === 'success',
    message: result.message
  };
}
```

## 🧠 Gerenciamento de Estado Avançado

### 🔧 Hooks Personalizados: Arquitetura e Padrões

#### Fundamentos Filosóficos
- **Separação de Preocupações**: Desacoplar lógica de estado da apresentação
- **Reutilização Inteligente**: Componentização da lógica de estado
- **Composabilidade**: Combinar comportamentos complexos de forma modular

#### Taxonomia de Hooks Personalizados

##### Nível 1: Hooks de Utilidade Básica
```typescript
// Hook de Manipulação de Formulários
function useForm<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (validationRules: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    (Object.keys(validationRules) as Array<keyof T>).forEach(key => {
      const rule = validationRules[key];
      const error = rule(values[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
    resetForm
  };
}

// Exemplo de Uso
function RegistrationForm() {
  const { 
    values, 
    errors, 
    handleChange, 
    validateForm, 
    resetForm 
  } = useForm({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm({
      username: (value) => 
        value.length < 3 ? 'Username must be at least 3 characters' : null,
      email: (value) => 
        !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : null,
      password: (value) => 
        value.length < 8 ? 'Password must be at least 8 characters' : null
    });

    if (isValid) {
      // Processar formulário
    }
  };

  return (/* Implementação do formulário */);
}
```

##### Nível 2: Hooks de Gerenciamento de Estado Assíncrono
```typescript
// Hook de Gerenciamento de Requisições
function useAsync<T>(
  asyncFunction: () => Promise<T>, 
  immediate = true
) {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response: T) => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch((error: Error) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { 
    execute, 
    status, 
    value, 
    error 
  };
}

// Exemplo de Uso
function UserProfile() {
  const { 
    execute: fetchUser, 
    status, 
    value: user, 
    error 
  } = useAsync(() => 
    fetch('/api/user').then(res => res.json())
  );

  if (status === 'pending') return <Spinner />;
  if (status === 'error') return <ErrorMessage error={error} />;
  
  return <UserDetails user={user} />;
}
```

### 🌐 Gerenciamento de Estado Global com Zustand

#### Arquitetura de Stores
```typescript
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Definição de Tipos
interface UserState {
  user: User | null;
  token: string | null;
}

interface UserActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}

// Store Centralizada
const useUserStore = create<UserState & UserActions>(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,

        login: async (credentials) => {
          try {
            const response = await authService.login(credentials);
            set({
              user: response.user,
              token: response.token
            }, false, 'user/login');
          } catch (error) {
            set({ user: null, token: null }, false, 'user/loginFailed');
            throw error;
          }
        },

        logout: () => {
          set({ user: null, token: null }, false, 'user/logout');
        },

        updateProfile: (profile) => {
          const currentUser = get().user;
          set({
            user: currentUser 
              ? { ...currentUser, ...profile } 
              : null
          }, false, 'user/updateProfile');
        }
      }),
      {
        name: 'user-storage',
        getStorage: () => localStorage
      }
    )
  )
);

// Store de Tema
const useThemeStore = create(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        toggleTheme: () => set(
          (state) => ({ 
            theme: state.theme === 'light' ? 'dark' : 'light' 
          }),
          false,
          'theme/toggle'
        )
      }),
      {
        name: 'theme-storage',
        getStorage: () => localStorage
      }
    )
  )
);

// Exemplo de Componente Consumidor
function ProfilePage() {
  const { user, logout } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div data-theme={theme}>
      {user ? (
        <>
          <UserProfile user={user} />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <LoginForm />
      )}
      <ThemeToggle onToggle={toggleTheme} />
    </div>
  );
}
```

### 🚀 Princípios Arquiteturais

#### Estratégias de Implementação
- **Modularidade**: Stores independentes e desacopladas
- **Persistência**: Armazenamento local transparente
- **Depuração**: Suporte a ferramentas de desenvolvimento
- **Imutabilidade**: Atualizações de estado seguras

#### Boas Práticas
- Manter stores pequenas e focadas
- Usar middleware para adicionar funcionalidades
- Evitar lógica complexa dentro das stores
- Implementar tipagem forte

### ⚠️ Pontos de Atenção
- Gerenciamento de performance em stores grandes
- Evitar acoplamento excessivo
- Cuidado com mutações diretas de estado
- Tratamento adequado de erros

### 🔬 Métricas de Qualidade
- Tamanho e complexidade das stores
- Tempo de renderização
- Número de re-renders
- Consumo de memória

## 🪝 Universo dos Hooks React: Arquitetura e Padrões

### 🔬 Fundamentos Filosóficos dos Hooks

#### Princípios Fundamentais
- **Composabilidade**: Modularização do comportamento de componentes
- **Declaratividade**: Expressar estado e efeitos de forma clara
- **Reutilização**: Compartilhamento de lógica entre componentes
- **Simplicidade**: Substituição de classes por funções

### 📊 Taxonomia de Hooks Nativos

#### 1. useState: Gerenciamento de Estado Local
```typescript
// Padrão Básico
function Counter() {
  const [count, setCount] = useState<number>(0);
  
  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}

// Inicialização Complexa
function UserPreferences() {
  const [preferences, setPreferences] = useState<UserPrefs>(() => {
    // Inicialização lazy - só executa uma vez
    const savedPrefs = localStorage.getItem('userPrefs');
    return savedPrefs 
      ? JSON.parse(savedPrefs) 
      : defaultPreferences;
  });

  // Função de atualização com callback
  const updateTheme = (newTheme: string) => {
    setPreferences(prev => ({
      ...prev,
      theme: newTheme
    }));
  };

  return (/* Implementação */);
}
```

#### 2. useEffect: Ciclo de Vida e Efeitos Colaterais
```typescript
function DataFetcher() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data', { 
          signal: controller.signal 
        });
        
        if (!response.ok) {
          throw new Error('Falha na requisição');
        }

        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro desconhecido'));
          setLoading(false);
        }
      }
    }

    fetchData();

    // Cleanup e cancelamento
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Array de dependências vazio

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <DataDisplay data={data} />;
}
```

#### 3. useContext: Injeção de Dependências
```typescript
// Criação do Contexto
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {}
});

// Provedor de Contexto
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Consumo do Contexto
function ThemedComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <p>Tema Atual: {theme}</p>
      <button onClick={toggleTheme}>Alternar Tema</button>
    </div>
  );
}
```

#### 4. useReducer: Gerenciamento de Estado Complexo
```typescript
// Definição do Reducer
type State = {
  count: number;
  step: number;
};

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep', payload: number };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function AdvancedCounter() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    step: 1
  });

  return (
    <div>
      <p>Contagem: {state.count}</p>
      <p>Passo: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        Incrementar
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Decrementar
      </button>
      <input 
        type="number" 
        value={state.step}
        onChange={(e) => dispatch({ 
          type: 'setStep', 
          payload: Number(e.target.value) 
        })}
      />
    </div>
  );
}
```

#### 5. useMemo: Memoização de Valores
```typescript
function ExpensiveCalculationComponent() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);

  // Cálculo memoizado
  const expensiveResult = useMemo(() => {
    console.log('Calculando...');
    return a * Math.pow(b, 10);
  }, [a, b]);

  return (
    <div>
      <input 
        type="number" 
        value={a} 
        onChange={(e) => setA(Number(e.target.value))}
      />
      <input 
        type="number" 
        value={b} 
        onChange={(e) => setB(Number(e.target.value))}
      />
      <p>Resultado: {expensiveResult}</p>
    </div>
  );
}
```

#### 6. useCallback: Memoização de Funções
```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);

  // Função memoizada
  const memoizedCallback = useCallback(() => {
    console.log(`Contagem atual: ${count}`);
  }, [count]);

  return (
    <div>
      <ChildComponent onAction={memoizedCallback} />
      <button onClick={() => setCount(c => c + 1)}>
        Incrementar
      </button>
    </div>
  );
}

// Componente filho otimizado
const ChildComponent = React.memo(({ onAction }) => {
  console.log('Renderizando ChildComponent');
  return <button onClick={onAction}>Executar Ação</button>;
});
```

#### 7. useRef: Referências Mutáveis
```typescript
function InputFocusExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focar Input</button>
      <p>Número de renderizações: {renderCount.current}</p>
    </div>
  );
}
```

#### 8. useImperativeHandle: Personalização de Refs
```typescript
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => value
  }));

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
});

function ParentComponent() {
  const inputRef = useRef(null);

  const handleClear = () => {
    inputRef.current?.clear();
  };

  return (
    <div>
      <CustomInput ref={inputRef} />
      <button onClick={handleClear}>Limpar</button>
    </div>
  );
}
```

### 🚀 Princípios Arquiteturais dos Hooks

#### Estratégias de Implementação
- **Composição**: Combinar hooks para criar comportamentos complexos
- **Imutabilidade**: Manter estado imutável
- **Minimalismo**: Hooks focados e simples
- **Previsibilidade**: Comportamento consistente

#### Boas Práticas
- Seguir as regras dos hooks
- Usar hooks personalizados para lógica reutilizável
- Evitar efeitos colaterais complexos
- Otimizar renderizações

### ⚠️ Pontos de Atenção
- Ordem de chamada dos hooks
- Dependências de hooks
- Performance de memoização
- Vazamentos de memória

### 🔬 Métricas de Qualidade
- Número de re-renders
- Complexidade ciclomática
- Tamanho dos hooks
- Tempo de renderização

## 🌊 React Suspense: Gerenciamento Avançado de Carregamento e Assincronicidade

### 🔬 Fundamentos Filosóficos

#### Princípios Fundamentais
- **Declaratividade Assíncrona**: Gerenciar estados de carregamento de forma declarativa
- **Separação de Preocupações**: Desacoplar lógica de carregamento da renderização
- **Experiência do Usuário**: Gerenciar transições e estados de carregamento de forma elegante
- **Programação Reativa**: Resposta automática a estados assíncronos

### 📐 Arquitetura do Suspense

#### Componentes Fundamentais
```typescript
import { 
  Suspense, 
  lazy, 
  startTransition,
  useTransition 
} from 'react';

// Carregamento Dinâmico de Componentes
const LazyComponent = lazy(() => 
  import('./HeavyComponent').then(
    module => ({ default: module.HeavyComponent })
  )
);

// Estratégia de Carregamento Avançada
function AsyncPage() {
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState(null);

  const loadData = () => {
    startTransition(() => {
      fetchComplexData().then(setData);
    });
  };

  return (
    <div>
      <button onClick={loadData}>
        {isPending ? 'Carregando...' : 'Carregar Dados'}
      </button>

      <Suspense fallback={<LoadingSpinner />}>
        {data ? <DataRenderer data={data} /> : null}
      </Suspense>
    </div>
  );
}
```

#### Padrões de Implementação
```typescript
// Gerenciamento de Recursos Assíncronos
function ResourceManager() {
  // Criação de Recursos Assíncronos
  const resource = use(fetchResource());

  return (
    <Suspense fallback={<ResourcePlaceholder />}>
      <ResourceRenderer resource={resource} />
    </Suspense>
  );
}

// Estratégia de Carregamento em Cascata
function NestedAsyncComponents() {
  return (
    <Suspense fallback={<MainLoader />}>
      <UserProfile>
        <Suspense fallback={<PostsLoader />}>
          <UserPosts>
            <Suspense fallback={<CommentsLoader />}>
              <PostComments />
            </Suspense>
          </UserPosts>
        </Suspense>
      </UserProfile>
    </Suspense>
  );
}
```

#### Técnicas Avançadas de Gerenciamento de Estado
```typescript
// Integração com Bibliotecas de Estado
function SuspenseStateIntegration() {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading' }));
    
    try {
      const result = await complexFetch();
      setState({
        status: 'success',
        data: result,
        error: null
      });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error
      });
    }
  }, []);

  return (
    <Suspense fallback={<GlobalLoader />}>
      {state.status === 'success' && (
        <DataRenderer data={state.data} />
      )}
      {state.status === 'error' && (
        <ErrorBoundary error={state.error} />
      )}
    </Suspense>
  );
}
```

#### Estratégias de Otimização
```typescript
// Pré-carregamento Inteligente
function SmartPreloader() {
  const [isHovered, setIsHovered] = useState(false);

  const preloadComponent = useCallback(() => {
    // Lógica de pré-carregamento
    const module = import('./HeavyComponent');
  }, []);

  return (
    <div 
      onMouseEnter={() => {
        setIsHovered(true);
        preloadComponent();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<Placeholder />}>
        {isHovered && <LazyComponent />}
      </Suspense>
    </div>
  );
}

// Carregamento Condicional
function ConditionalSuspense() {
  const [showContent, setShowContent] = useState(false);

  return (
    <div>
      <button onClick={() => setShowContent(true)}>
        Carregar Conteúdo
      </button>

      {showContent && (
        <Suspense fallback={<DetailedLoader />}>
          <ComplexDataView />
        </Suspense>
      )}
    </div>
  );
}
```

### 🚀 Princípios Arquiteturais

#### Estratégias de Implementação
- **Granularidade**: Suspense em níveis múltiplos
- **Progressividade**: Carregamento incremental
- **Resiliência**: Tratamento declarativo de estados assíncronos
- **Performance**: Minimizar bloqueios de renderização

#### Boas Práticas
- Usar Suspense para carregamento de componentes
- Implementar fallbacks significativos
- Gerenciar transições de estado
- Combinar com Error Boundaries

### ⚠️ Pontos de Atenção
- Complexidade de implementação
- Overhead de gerenciamento de estado
- Compatibilidade com bibliotecas
- Gerenciamento de erros assíncronos

### 🔬 Métricas de Qualidade
- Tempo de carregamento inicial
- Número de re-renders
- Complexidade de transições
- Experiência do usuário durante carregamentos

### 📚 Casos de Uso Avançados
- Carregamento de módulos
- Renderização de dados assíncronos
- Transições de interface
- Pré-carregamento condicional

## 🔒 Políticas de Componentização

### Princípios de Design
1. **Componentes Puros**
2. **Mínima Superfície de API**
3. **Composabilidade**
4. **Renderização Condicional Eficiente**

### Padrões de Renderização
```typescript
// Renderização Condicional Avançada
const ConditionalRenderer: React.FC<{
  condition: boolean;
  renderIf: React.ReactNode;
  renderElse?: React.ReactNode;
}> = ({ condition, renderIf, renderElse = null }) => {
  return condition ? renderIf : renderElse;
};
```

## 🚨 Anti-Padrões

### 🚫 Evitar
- Componentes Monolíticos
- Prop Drilling
- Mutações Diretas de Estado
- Renderizações Desnecessárias

### ✅ Recomendado
- Componentes Pequenos e Focados
- Uso de Composition
- Memoização Estratégica
- Lazy Loading

## 🤖 Otimização de Performance

### Técnicas Avançadas
- Code Splitting
- Lazy Loading de Componentes
- Memoização com `useMemo` e `useCallback`
- Otimização de Renderização com `React.memo`

## 📡 Comunicação e Integração

### Padrões de Comunicação
- Zustand para Estados Globais
- Prop Drilling Controlado
- Event Emitters para Comunicação Desacoplada

## 🔍 Casos Especiais

### Tratamento de Erros
```typescript
// Boundary de Erro Personalizado
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log de erro
    logErrorToService(error);
  }

  render() {
    return this.state.hasError 
      ? this.props.fallback 
      : this.props.children;
  }
}
```

## 📚 Guia de Referência Rápida

### Boas Práticas
- Mantenha componentes pequenos
- Use tipagem forte
- Documente interfaces de componentes
- Priorize imutabilidade

## 🚀 Evolução Contínua

### Processo de Atualização
1. Revisões trimestrais
2. Workshops de Arquitetura
3. Análise de Performance
4. Refinamento de Padrões

**Última Atualização**: {{ data_atual }}
**Versão**: 3.0 - Universo dos Hooks React

```
