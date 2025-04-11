# Web Project API Full

Este repositório contém um projeto completo de uma aplicação web que possui um backend e um frontend. Ele foi desenvolvido para oferecer uma arquitetura bem estruturada e moderna usando tecnologias populares, como Node.js, Express, MongoDB no backend, e React no frontend.

---

## 📖 Visão Geral

O projeto é dividido em dois principais diretórios:

- **Backend**: Gerencia a lógica do servidor, autenticação, API RESTful e integração com banco de dados.
- **Frontend**: Interface de usuário construída com React, interagindo com a API fornecida pelo backend.

---

## ✨ Tecnologias Usadas

### Backend

- **Node.js**: Plataforma para execução do JavaScript no servidor.
- **Express.js**: Framework web para construir APIs RESTful.
- **MongoDB**: Banco de dados NoSQL para armazenamento de dados.
- **JWT (JSON Web Token)**: Autenticação e autorização.
- **Mongoose**: ODM para modelar dados no MongoDB.

### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de construção rápida para desenvolvimento com React.
- **CSS**: Para estilização da interface.
- **ESLint**: Configuração para garantir qualidade de código.

---

## 📂 Estrutura de Diretórios

### Backend

- **`backend/app.js`**: Arquivo de entrada do servidor.
- **`backend/controllers`**: Contém controladores para gerenciar a lógica de negócios.
  - [cards.js](backend/controllers/cards.js)
  - [users.js](backend/controllers/users.js)
- **`backend/enums`**: Contém enums de configuração, como [http.js](backend/enums/http.js).
- **`backend/middlewares`**: Middlewares para tratamentos específicos.
  - [auth.js](backend/middlewares/auth.js): Middleware para autenticação.
  - [errorHandler.js](backend/middlewares/errorHandler.js): Middleware para tratamento de erros.
- **`backend/models`**: Modelos de dados para o MongoDB.
  - [card.js](backend/models/card.js)
  - [user.js](backend/models/user.js)
- **`backend/routes`**: Gerencia as rotas da aplicação.
  - [cards.js](backend/routes/cards.js)
  - [users.js](backend/routes/users.js)
- **`backend/validators`**: Validações para entrada de dados.
  - [cardsValidator.js](backend/validators/cardsValidator.js)
  - [usersValidator.js](backend/validators/usersValidator.js)

### Frontend

- **`frontend/src`**: Contém os principais arquivos do React.
  - **`components`**: Componentes reutilizáveis.
  - **`pages`**: Páginas principais da aplicação.
  - **`utils`**: Funções utilitárias.
  - **`index.css`**: Estilos globais.
  - **`main.jsx`**: Arquivo de entrada do React.
- **`frontend/public`**: Arquivos públicos, como [vite.svg](frontend/public/vite.svg).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado (v16+).
- MongoDB configurado e rodando localmente ou em um servidor.

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Inicie o servidor:
   ```bash
   npm start
   ```

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🛠️ Funcionalidades

1. **Autenticação**:
   - Login com JWT.
2. **Gerenciamento de Usuários**:
   - CRUD de perfis de usuários.
3. **Gerenciamento de Cards**:
   - Adicionar, editar, curtir e excluir cards.
4. **Frontend Dinâmico**:
   - Interface interativa e responsiva construída com React.

---

## 🆕 Novas Implementações Propostas

Aqui estão algumas funcionalidades que podem ser adicionadas ao frontend para enriquecer ainda mais a experiência do usuário:

### 1. Sistema de Favoritos:

Adicionar funcionalidade de "favoritar" ou "salvar" itens importantes para rápido acesso posterior.

---

### 2. Animações e Transições

Melhorar a experiência geral do usuário ao adicionar:

- Animações suaves durante a navegação entre páginas.
- Efeitos visuais para feedback ao clicar em botões ou enviar formulários.

---

### 3. Componentes de Acessibilidade

Tornar a aplicação mais acessível para todos os usuários, implementando:

- Navegação por teclado.
- Suporte para leitores de tela.
- Opções de alto contraste para pessoas com deficiência visual.

**Benefícios**:

- Garante conformidade com padrões de acessibilidade (WCAG).
- Melhora a experiência para todos os usuários, independentemente de suas limitações.

---

## 📝 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

## 📧 Contato

Para dúvidas ou sugestões, entre em contato:

- **Autor**: [phendges7](https://github.com/phendges7)
