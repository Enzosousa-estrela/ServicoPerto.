# ServiçoPerto - Monetization & Structure

Esta pasta contém a estrutura completa do projeto para iniciar a monetização.

## Estrutura de Pastas

- `/backend`: Servidor Node.js (API).
- `/frontend`: Interface React (App).
- `/backend/schema.sql`: Script do Banco de Dados.

## Como Rodar (Passo a Passo)

### 1. Banco de Dados (Postgres)
Crie um banco de dados e rode o script `schema.sql`:
```bash
psql -d servicoperto -f backend/schema.sql
```

### 2. Backend (Servidor)
Você precisa instalar o Node.js (https://nodejs.org/).
```bash
cd backend
npm install
# Crie um arquivo .env com DATABASE_URL=postgres://user:pass@localhost:5432/servicoperto
npm start
```

### 3. Frontend (Interface)
```bash
cd frontend
npm install
npm run dev
```

### 4. Marketing
O plano de marketing está no arquivo `marketing_strategy.md` na sua pasta de documentos.

## Funcionalidades Implementadas
- Validação de Pagamentos (Web, Google Play, Apple Store).
- Página de Planos e Preços.
- Integração com Banco de Dados.
