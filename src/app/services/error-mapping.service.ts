import { Injectable } from '@angular/core';

export interface ErrorMapping {
  pattern: RegExp;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorMappingService {
  private errorMappings: ErrorMapping[] = [
    // Erros de autenticação
    {
      pattern: /invalid email or password/i,
      message: 'Email ou senha inválidos. Verifique suas credenciais e tente novamente.'
    },
    {
      pattern: /invalid credentials/i,
      message: 'Credenciais inválidas. Verifique seu email e senha.'
    },
    {
      pattern: /unauthorized/i,
      message: 'Acesso não autorizado. Faça login novamente.'
    },
    {
      pattern: /token expired/i,
      message: 'Sessão expirada. Faça login novamente.'
    },
    
    // Erros de tentativas de login
    {
      pattern: /too many login attempts/i,
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    {
      pattern: /account locked/i,
      message: 'Conta temporariamente bloqueada devido a muitas tentativas de login.'
    },
    
    // Erros de saldo
    {
      pattern: /insufficient balance/i,
      message: 'Saldo insuficiente para realizar esta operação.'
    },
    {
      pattern: /insufficient funds/i,
      message: 'Fundos insuficientes para completar a transação.'
    },
    {
      pattern: /balance too low/i,
      message: 'Saldo muito baixo para esta operação.'
    },
    
    // Erros de validação
    {
      pattern: /validation failed/i,
      message: 'Dados inválidos. Verifique as informações e tente novamente.'
    },
    {
      pattern: /invalid input/i,
      message: 'Entrada inválida. Verifique os dados informados.'
    },
    {
      pattern: /required field/i,
      message: 'Campo obrigatório não preenchido.'
    },
    {
      pattern: /invalid format/i,
      message: 'Formato inválido. Verifique os dados informados.'
    },
    {
      pattern: /invalid amount/i,
      message: 'Valor inválido. Digite um valor válido.'
    },
    
    // Erros de conta
    {
      pattern: /account not found/i,
      message: 'Conta não encontrada.'
    },
    {
      pattern: /account already exists/i,
      message: 'Esta conta já existe.'
    },
    {
      pattern: /account inactive/i,
      message: 'Conta inativa. Entre em contato com o suporte.'
    },
    
    // Erros de usuário
    {
      pattern: /user not found/i,
      message: 'Usuário não encontrado.'
    },
    {
      pattern: /user already exists/i,
      message: 'Este usuário já existe.'
    },
    {
      pattern: /email already in use/i,
      message: 'Este email já está sendo usado por outro usuário.'
    },
    
    // Erros de transação
    {
      pattern: /transaction failed/i,
      message: 'Falha na transação. Tente novamente.'
    },
    {
      pattern: /transaction not found/i,
      message: 'Transação não encontrada.'
    },
    {
      pattern: /transaction limit exceeded/i,
      message: 'Limite de transação excedido.'
    },
    
    // Erros de rede
    {
      pattern: /network error/i,
      message: 'Erro de conexão. Verifique sua internet e tente novamente.'
    },
    {
      pattern: /timeout/i,
      message: 'Tempo limite excedido. Tente novamente.'
    },
    {
      pattern: /connection refused/i,
      message: 'Conexão recusada. Tente novamente mais tarde.'
    },
    
    // Erros do servidor
    {
      pattern: /internal server error/i,
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    },
    {
      pattern: /service unavailable/i,
      message: 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
    },
    {
      pattern: /bad gateway/i,
      message: 'Erro no servidor. Tente novamente mais tarde.'
    },
    
    // Erros de permissão
    {
      pattern: /forbidden/i,
      message: 'Você não tem permissão para realizar esta ação.'
    },
    {
      pattern: /access denied/i,
      message: 'Acesso negado.'
    },
    
    // Erros gerais
    {
      pattern: /not found/i,
      message: 'Recurso não encontrado.'
    },
    {
      pattern: /bad request/i,
      message: 'Solicitação inválida. Verifique os dados e tente novamente.'
    }
  ];

  /**
   * Mapeia uma mensagem de erro em inglês para português
   * @param errorMessage Mensagem de erro original
   * @returns Mensagem traduzida ou a mensagem original se não houver mapeamento
   */
  mapErrorMessage(errorMessage: string): string {
    if (!errorMessage) {
      return 'Erro desconhecido. Tente novamente.';
    }

    // Procura por um padrão que corresponda à mensagem de erro
    for (const mapping of this.errorMappings) {
      if (mapping.pattern.test(errorMessage)) {
        return mapping.message;
      }
    }

    // Se não encontrar um mapeamento específico, retorna uma mensagem genérica
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }

  /**
   * Mapeia um objeto de erro HTTP para uma mensagem amigável
   * @param error Objeto de erro da API
   * @returns Mensagem traduzida
   */
  mapHttpError(error: any): string {
    // Tenta extrair a mensagem de erro de diferentes estruturas
    let errorMessage = '';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error) {
      errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    } else {
      errorMessage = error.toString();
    }

    return this.mapErrorMessage(errorMessage);
  }

  /**
   * Mapeia erros específicos por código de status HTTP
   * @param statusCode Código de status HTTP
   * @param errorMessage Mensagem de erro opcional
   * @returns Mensagem traduzida
   */
  mapByStatusCode(statusCode: number, errorMessage?: string): string {
    // Se há uma mensagem de erro específica, tenta mapear ela primeiro
    if (errorMessage) {
      const mappedMessage = this.mapErrorMessage(errorMessage);
      if (mappedMessage !== 'Ocorreu um erro inesperado. Tente novamente.') {
        return mappedMessage;
      }
    }

    // Mapeamento por código de status
    switch (statusCode) {
      case 400:
        return 'Solicitação inválida. Verifique os dados e tente novamente.';
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito nos dados. O recurso já existe ou está sendo usado.';
      case 422:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 429:
        return 'Muitas solicitações. Tente novamente mais tarde.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 502:
        return 'Erro no servidor. Tente novamente mais tarde.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      case 504:
        return 'Tempo limite excedido. Tente novamente.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }
}
