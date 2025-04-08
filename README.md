# Dashboard Administrativo

Um painel administrativo moderno para visualização de dados e métricas de desempenho de negócios.

## 🚀 Tecnologias

- Frontend:

  - React com TypeScript
  - Material-UI para interface
  - D3.js para visualização de dados
  - React Router para navegação
  - Axios para requisições HTTP

- Backend:
  - Node.js com Express
  - TypeScript
  - MySQL para banco de dados
  - JWT para autenticação
  - bcrypt para criptografia

## 📋 Pré-requisitos

- Node.js >= 14.x
- MySQL >= 8.x
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/dashboard.git
cd dashboard
```

2. Instale as dependências do frontend:

```bash
npm install
```

3. Instale as dependências do backend:

```bash
cd backend
npm install
```

4. Configure o banco de dados:

- Crie um banco de dados MySQL
- Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente

5. Inicie o backend:

```bash
cd backend
npm run dev
```

6. Em outro terminal, inicie o frontend:

```bash
npm run dev
```

## 🔑 Credenciais padrão

- Email: admin@example.com
- Senha: admin123

## 📊 Funcionalidades

- Dashboard interativo com:

  - KPIs de desempenho
  - Gráficos de vendas
  - Análise por categoria
  - Filtros por período

- Gerenciamento de:
  - Usuários
  - Produtos
  - Vendas

## 🛠️ Estrutura do Projeto

```
dashboard/
├── src/                    # Frontend
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços e API
│   ├── utils/             # Utilitários
│   └── contexts/          # Contextos React
│
└── backend/               # Backend
    ├── src/
    │   ├── config/       # Configurações
    │   ├── controllers/  # Controladores
    │   ├── middlewares/  # Middlewares
    │   └── routes/       # Rotas da API
    └── package.json
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📫 Contato

Seu Nome - [@seutwitter](https://twitter.com/seutwitter) - email@exemplo.com

Link do projeto: [https://github.com/seu-usuario/dashboard](https://github.com/seu-usuario/dashboard)
