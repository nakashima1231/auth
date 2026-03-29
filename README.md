# Node.js Auth JWT  
  
API de autenticação e gerenciamento de usuários construída com **Node.js**, **Express** e **MySQL**, utilizando **JWT** para proteção de rotas e **bcrypt** para criptografia de senhas.  
  
---  
  
## Tecnologias  
  
* **Node.js**  
* **Express**  
* **MySQL**  
* **JWT** (JSON Web Token)  
* **bcrypt** (Hash de senha)  
* **dotenv** (Variáveis de ambiente)  
  
---  
  
## Funcionalidades  
  
* **Registrar novos usuários** (`/register`)  
* **Login com geração de JWT** (`/login`)  
* **Listar usuários** (`/users`) — *Protegido por JWT*  
* **Atualizar e deletar usuários** — *Protegido por JWT*  
* **Dashboard** (`/dashboard`) — Retorna dados do usuário logado  
* **Painel Admin** (`/admin`) — Lista todos os usuários com opção de:  
	* **Excluir usuário**  
	* **Promover usuário a admin**  
	> *Acesso restrito apenas a administradores*  
  
---  
  
## Estrutura do Projeto  
  
```text  
├── controllers/ # Lógica das rotas  
├── middlewares/ # Middleware de autenticação JWT  
├── models/ # Conexão e queries MySQL  
├── routes/ # Definição das rotas  
├── template/ # Arquivos HTML (opcional)  
├── database/ # Configuração do banco de dados  
├── app.js # Arquivo principal (Entry point)  
└── .env # Variáveis de ambiente (sensível)
```
---

## Como Rodar


1. Clonar o repositório:

```bash
git clone https://github.com/nakashima1231/nodejs-auth-jwt
cd nodejs-auth-jwt
```
2. Instalar dependências:

```bash
npm install
```
3. Criar arquivo .env com suas variáveis:
```
JWT_SECRET=seusegredo
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=nomeDoBanco
```
4. Rodar o servidor:

```
node app.js
```
ou com Nodemon:
```
nodemon app.js
```
---
## Testando

-   Use Postman, Insomnia ou outro cliente HTTP para testar as rotas.
    
-   O login (`/login`) retorna um JWT, que deve ser enviado no header `Authorization: Bearer TOKEN` para acessar rotas protegidas.
    
-   Dashboard e outras rotas protegidas exigem token válido.
-  O painel admin `(/admin`) exige usuários com role` admin`.
 ---

## Observações

-   Senhas são criptografadas com bcrypt.
    
-   JWT expira em 1 hora.
    
-   Rotas de front-end (`.html`) são servidas via `express.static`.
---
    

## Autor
Gabriel Makiyama Nakashima
gabrielmnakashima2@gmail.com
