# Guia de Definição de Tipos para APIs

## 1. Introdução

### 1.1 Objetivo
Este documento define um padrão centralizado para tipagem de respostas de API em projetos frontend, garantindo consistência, reutilização e clareza no tratamento de dados.

## 2. Princípios Fundamentais

### 2.1 Por que Centralizar Tipos de API?
- **Consistência**: Padrão único para todas as respostas
- **Reutilização**: Tipos genéricos e específicos
- **Manutenção**: Fácil atualização e documentação
- **Segurança**: Validação de tipos em tempo de compilação

### 2.2 Quando Usar
- Em todos os serviços de comunicação com backend
- Ao definir contratos de dados entre frontend e backend
- Para padronizar respostas de diferentes endpoints

### 2.3 Quando Não Usar
- Dados completamente voláteis ou extremamente específicos
- Protótipos rápidos sem estrutura definida
- Quando a API ainda não tem um contrato estável

## 3. Estrutura de Tipos

### 3.1 Tipos Básicos

#### ApiResponse
- Envelope padrão para todas as respostas
- Inclui dados, status, mensagem e sucesso

```typescript
interface ApiResponse<T> {
  data: T | null;
  message?: string;
  status: number;
  success: boolean;
}
```

#### Casos de Uso
```typescript
// Exemplo de uso
async function fetchUser(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
```

### 3.2 Tipos Específicos

#### UserProfile
- Informações detalhadas de usuário
- Campos básicos e opcionais

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
}
```

### 3.3 Respostas Paginadas

```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## 4. Boas Práticas

### 4.1 Definição de Tipos
- Use `interface` para objetos complexos
- Prefira tipos descritivos e específicos
- Utilize generics para flexibilidade

### 4.2 Validação de Tipos

```typescript
// Type Guard para validação
function isApiResponse<T>(
  response: unknown
): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'status' in response &&
    'success' in response
  );
}
```

## 5. Padrões de Erro

### 5.1 Tratamento de Erros

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

## 6. Enums e Constantes

### 6.1 Status HTTP
```typescript
enum HttpStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404
}
```

## 7. Exemplos Completos

### 7.1 Serviço de Usuário

```typescript
class UserService {
  async getProfile(
    userId: string
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await this.apiClient.get(`/users/${userId}`);
      
      if (!isApiResponse<UserProfile>(response)) {
        throw new Error('Invalid response');
      }
      
      return response;
    } catch (error) {
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

## 8. Considerações Finais

### 8.1 Recomendações
- Mantenha os tipos atualizados
- Documente mudanças na API
- Revise regularmente a estrutura de tipos
- Comunique mudanças com a equipe de backend

### 8.2 Próximos Passos
- Integrar com documentação de API
- Gerar tipos automaticamente (se possível)
- Criar testes de tipagem

## 9. Referências
- TypeScript Documentation
- OpenAPI/Swagger Specifications
- JSON Schema

## 10. Changelog
- v1.0.0: Versão inicial
- v1.1.0: Adição de type guards
- v1.2.0: Melhoria nos tipos de erro
