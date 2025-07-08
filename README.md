# Balance Management Frontend

Um aplicativo Angular v18 simples com o framework de testes Jest.

## Funcionalidades

- Angular v18 com componentes independentes
- Framework de testes Jest
- Configuração TypeScript
- Estilização com SCSS
- Design responsivo
- Configuração de desenvolvimento moderna

## Primeiros Passos

### Pré-requisitos

- Node.js (v18.x ou superior)
- npm (v9.x ou superior)

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

### Testes

Execute a suíte de testes:
```bash
npm test
```

Execute os testes com cobertura:
```bash
npm run test:coverage
```

Execute os testes em modo de observação:
```bash
npm run test:watch
```

### Build

Compile o projeto para produção:
```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── home/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── index.html
├── main.ts
└── styles.scss
```

## Tecnologias Utilizadas

- **Angular**: v18.x
- **TypeScript**: v5.5.x
- **Jest**: v29.x
- **SCSS**: Para estilização
- **RxJS**: Para programação reativa

## Scripts

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila para produção
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo de observação
- `npm run test:coverage`: Executa os testes com relatório de cobertura
- `npm run lint`: Executa o linter

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch de funcionalidade
3. Faça suas alterações
4. Escreva testes para suas alterações
5. Execute os testes para garantir que eles passem
6. Envie um pull request

## Licença

Este projeto está licenciado sob a Licença MIT.
