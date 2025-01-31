# Guia de Estilo de Código Frontend: Convenções de Nomenclatura de Funções

## 1. Convenções de Nomenclatura para Interação com API

### Métodos HTTP
- **GET**: `fetch[Resource]`
  - Exemplo: `fetchUsers()`, `fetchUserProfile()`
  - Retorna dados sem modificar o estado do servidor

- **POST**: `create[Resource]`
  - Exemplo: `createUser()`, `createPost()`
  - Envia novos dados para serem armazenados no servidor

- **PUT/PATCH**: `update[Resource]`
  - Exemplo: `updateUser()`, `updateUserProfile()`
  - Modifica recurso existente no servidor

- **DELETE**: `remove[Resource]` ou `delete[Resource]`
  - Exemplo: `removeUser()`, `deletePost()`
  - Exclui um recurso específico do servidor

### Variações de Requisições de API
- `get[Resource]List()`: Buscar múltiplos recursos
- `get[Resource]Details()`: Buscar informações detalhadas
- `search[Resource]()`: Realizar uma consulta de busca

## 2. Convenções de Nomenclatura para Tratamento de Eventos

### Interações do Usuário
- `handle[Event][Target]`
  - Exemplo: `handleClick()`, `handleSubmit()`, `handleInputChange()`
  - Manipuladores de eventos genéricos

- `on[Event][Target]`
  - Exemplo: `onUserLogin()`, `onModalClose()`
  - Funções de callback para eventos específicos

### Eventos Personalizados
- `trigger[Event]`
  - Exemplo: `triggerNotification()`, `triggerModalOpen()`
  - Eventos personalizados disparados manualmente

## 3. Funções de Gerenciamento de Estado

### Setters
- `set[State]`
  - Exemplo: `setUserData()`, `setIsLoading()`
  - Atualiza estado do componente ou estado global

### Alternadores
- `toggle[State]`
  - Exemplo: `toggleModal()`, `toggleSidebar()`
  - Alterna estados booleanos

## 4. Funções Utilitárias

### Transformações
- `transform[Input]To[Output]`
  - Exemplo: `transformDateToLocale()`, `transformApiResponseToModel()`

### Validações
- `validate[Input]`
  - Exemplo: `validateEmail()`, `validatePassword()`

### Cálculos
- `calculate[Metric]`
  - Exemplo: `calculateTotal()`, `calculateDiscount()`

## 5. Funções Assíncronas
- Prefixar com `async`
  - Exemplo: `asyncFetchUsers()`, `asyncCreatePost()`

## 6. Tratamento de Erros
- `handle[Resource]Error`
  - Exemplo: `handleUserFetchError()`, `handleSubmissionError()`

## 7. Desempenho e Memoização
- `memo[Function]`
  - Exemplo: `memoCalculateTotal()`

## Melhores Práticas
- Seja descritivo, mas conciso
- Use camelCase
- Evite abreviações
- Indique claramente o propósito da função
- Mantenha consistência em todo o projeto

## Exemplo de Implementação

```javascript
// Exemplo Bom
const fetchUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleUserFetchError(error);
  }
};

const handleUserLogin = (credentials) => {
  setIsLoading(true);
  triggerLoginAttempt(credentials);
};
```

## Exceções e Flexibilidade
- Estas são diretrizes, não regras rígidas
- Consenso da equipe é fundamental
- Adapte-se às necessidades específicas do projeto
