# Serviço de Mapeamento de Erros

O `ErrorMappingService` foi criado para traduzir automaticamente as mensagens de erro da API do inglês para o português, fornecendo uma experiência mais amigável ao usuário.

## Características

- **Tradução automática**: Mapeia erros comuns da API para mensagens em português
- **Mapeamento por padrão**: Usa expressões regulares para identificar tipos de erro
- **Mapeamento por status HTTP**: Fornece mensagens padrão baseadas no código de status
- **Fallback inteligente**: Retorna mensagens genérica quando não encontra mapeamento específico

## Erros Mapeados

### Erros de Autenticação
- `Invalid email or password` → "Email ou senha inválidos. Verifique suas credenciais e tente novamente."
- `Invalid credentials` → "Credenciais inválidas. Verifique seu email e senha."
- `Too many login attempts` → "Muitas tentativas de login. Tente novamente em 15 minutos."

### Erros de Saldo
- `Insufficient balance` → "Saldo insuficiente para realizar esta operação."
- `Insufficient funds` → "Fundos insuficientes para completar a transação."

### Erros de Validação
- `Validation failed` → "Dados inválidos. Verifique as informações e tente novamente."
- `Invalid input` → "Entrada inválida. Verifique os dados informados."
- `Invalid amount` → "Valor inválido. Digite um valor válido."

### Erros do Servidor
- `Internal server error` → "Erro interno do servidor. Tente novamente mais tarde."
- `Service unavailable` → "Serviço temporariamente indisponível. Tente novamente mais tarde."

## Como Usar

### 1. Nos Interceptors (Automático)

O serviço já está integrado no `authInterceptor`, então todos os erros HTTP são automaticamente traduzidos:

```typescript
// Não é necessário fazer nada, o interceptor já mapeia automaticamente
```

### 2. Nos Serviços

Os serviços `AuthService` e `AccountService` já estão configurados para usar o mapeamento:

```typescript
// Exemplo no AuthService
tap({
  error: (error) => {
    const errorMessage = this.errorMappingService.mapHttpError(error);
    this.errorSubject.next(errorMessage);
  }
})
```

### 3. Uso Direto nos Componentes

Para casos específicos onde você quer mapear erros diretamente:

```typescript
import { ErrorMappingService } from '../services/error-mapping.service';

export class MyComponent {
  constructor(private errorMappingService: ErrorMappingService) {}

  handleError(error: any) {
    // Mapeia o erro HTTP completo
    const message = this.errorMappingService.mapHttpError(error);
    
    // Ou mapeia apenas a mensagem
    const message2 = this.errorMappingService.mapErrorMessage(error.message);
    
    // Ou mapeia por status code
    const message3 = this.errorMappingService.mapByStatusCode(error.status, error.message);
    
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }
}
```

### 4. Testando os Mapeamentos

Baseado nos exemplos de erro fornecidos:

```json
{
  "error": "Internal server error",
  "message": "Insufficient balance",
  "timestamp": "2025-07-08T14:48:49.083Z",
  "path": "/api/accounts/14/withdraw"
}
```
→ Será mapeado para: **"Saldo insuficiente para realizar esta operação."**

```json
{
  "error": "Validation failed",
  "message": "Invalid email or password",
  "details": {
    "validationErrors": ["Invalid credentials"]
  },
  "timestamp": "2025-07-08T14:52:29.796Z",
  "path": "/api/auth/login"
}
```
→ Será mapeado para: **"Email ou senha inválidos. Verifique suas credenciais e tente novamente."**

```json
{
  "error": "Too many login attempts",
  "message": "Too many login attempts, please try again in 15 minutes"
}
```
→ Será mapeado para: **"Muitas tentativas de login. Tente novamente em 15 minutos."**

## Adicionando Novos Mapeamentos

Para adicionar novos mapeamentos, edite o array `errorMappings` no `ErrorMappingService`:

```typescript
{
  pattern: /novo padrão de erro/i,
  message: 'Nova mensagem em português'
}
```

## Estrutura do Serviço

O serviço possui três métodos principais:

- `mapErrorMessage(errorMessage: string)`: Mapeia uma mensagem de erro específica
- `mapHttpError(error: any)`: Mapeia um objeto de erro HTTP completo
- `mapByStatusCode(statusCode: number, errorMessage?: string)`: Mapeia por código de status

O serviço tenta primeiro mapear a mensagem específica do erro. Se não encontrar um mapeamento, usa o código de status HTTP. Como último recurso, retorna uma mensagem genérica.
