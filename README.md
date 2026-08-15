<h1 align="center">💸 RefundFlow</h1>

<p align="center">
  Sistema fullstack de solicitação e aprovação de reembolsos corporativos — com autenticação por perfil, upload de comprovante e dashboard de aprovação.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  <a href="#-como-rodar-localmente">Como rodar</a> ·
  <a href="#-rotas-da-api">API</a> ·
  <a href="./GUIDE.md">📘 Guia de deploy (do zero)</a>
</p>

---

> [!NOTE]
> Projeto desenvolvido durante a trilha **Node.js + React** da [Rocketseat](https://www.rocketseat.com.br/), unindo os dois módulos (API e front-end) em um único repositório fullstack.

## Sobre o projeto

O RefundFlow simula o fluxo de reembolso de despesas de uma empresa, com dois perfis de acesso:

- 🧑‍💼 **Funcionário (`employee`)** — abre uma solicitação de reembolso informando nome, categoria, valor e o comprovante (upload de imagem), e acompanha a confirmação do envio.
- 👩‍💼 **Gestor (`manager`)** — acessa o dashboard com todas as solicitações da empresa, pesquisa por nome, navega entre páginas e abre o detalhe (somente leitura) de cada uma.

O acesso é controlado por autenticação **JWT**, e cada perfil enxerga um conjunto diferente de rotas — tanto no front-end (`web/src/routes`) quanto protegido no back-end (`api/src/middlewares`).

## 🔗 Demo

| | |
| --- | --- |
| Front-end (GitHub Pages) | https://danilo-guimaraes.github.io/refundflow/ |
| Código da API | [`api/`](./api) |
| Código do front-end | [`web/`](./web) |

> [!IMPORTANT]
> O GitHub Pages hospeda **apenas conteúdo estático**, então só o front-end (`web/`) vai para lá. A API (`api/`) não tem onde rodar sozinha no Pages — para usar o RefundFlow com login, cadastro e upload funcionando de verdade, rode a API localmente seguindo o [Guia de Deploy](./GUIDE.md#3-rodando-a-api-localmente). Sem a API no ar, a demo publicada mostra as telas, mas as chamadas de login/cadastro vão falhar.

## 🧱 Arquitetura

Monorepo com duas aplicações independentes, conectadas via HTTP:

```
refundflow/
├── api/   → API REST (Node.js + Express + Prisma + SQLite)
└── web/   → Front-end (React + Vite + Tailwind CSS)
```

A URL da API que o front-end consome é configurável por variável de ambiente (`VITE_API_URL`, veja [`web/.env.example`](./web/.env.example)), então o mesmo front-end pode apontar tanto para `http://localhost:3333` em desenvolvimento quanto para uma API publicada em produção.

## 🚀 Tecnologias

**Front-end** (`web/`)

| Tecnologia | Uso |
| --- | --- |
| [React 19](https://react.dev/) | UI, componentes e hooks |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vite.dev/) | Build tool e dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilização utilitária |
| [React Router v7](https://reactrouter.com/) | Roteamento client-side por perfil |
| [Axios](https://axios-http.com/) | Cliente HTTP para a API |
| [Zod](https://zod.dev/) | Validação de formulários |

**Back-end** (`api/`)

| Tecnologia | Uso |
| --- | --- |
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | Servidor HTTP e rotas |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Prisma ORM](https://www.prisma.io/) + [SQLite](https://www.sqlite.org/) | Persistência de dados |
| [JWT](https://github.com/auth0/node-jsonwebtoken) | Autenticação por token |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senha |
| [Multer](https://github.com/expressjs/multer) | Upload do comprovante |
| [Zod](https://zod.dev/) | Validação de payloads |

## 📐 Regras de negócio

- Todo usuário tem um papel (`role`): `employee` ou `manager`.
- Cadastro e login são públicos; todas as demais rotas exigem token JWT.
- Só `employee` cria solicitações de reembolso e envia comprovante.
- Só `manager` lista todas as solicitações (com paginação e busca por nome).
- `employee` e `manager` podem ver o detalhe de uma solicitação específica.
- Categorias válidas: `food`, `others`, `services`, `transport`, `accommodation`.
- O comprovante deve ser `jpeg`, `jpg` ou `png`, com até 3MB.

## 🔌 Rotas da API

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/users` | Não | Cria um novo usuário |
| `POST` | `/sessions` | Não | Login — retorna o token JWT |
| `POST` | `/uploads` | Sim | Envia o comprovante (`multipart/form-data`, campo `file`) |
| `POST` | `/refunds` | `employee` | Cria uma solicitação de reembolso |
| `GET` | `/refunds` | `manager` | Lista solicitações (paginado, `?name=&page=&perPage=`) |
| `GET` | `/refunds/:id` | `employee` ou `manager` | Detalha uma solicitação |

Requisições autenticadas enviam o token no header:

```
Authorization: Bearer <token>
```

## 📂 Estrutura de pastas

```
api/src/
├── configs/       # Configuração de auth e upload
├── controllers/   # Regras de cada rota
├── database/      # Instância do Prisma Client
├── middlewares/   # Autenticação, autorização e tratamento de erros
├── providers/     # Armazenamento em disco (upload)
├── routes/        # Definição das rotas
└── app.ts / server.ts

web/src/
├── assets/        # Ícones e imagens (SVG)
├── components/    # Componentes reutilizáveis (Button, Input, Select, Header...)
├── contexts/       # AuthContext — sessão do usuário
├── pages/         # Telas (SignIn, SignUp, Refund, Confirm, Dashboard, NotFound)
├── routes/        # Rotas separadas por perfil (Auth / Employee / Manager)
├── services/       # Cliente Axios da API
└── utils/         # Categorias, formatação de moeda, merge de classes
```

## ⚙️ Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 20+ e npm.

### 1. Clonar o repositório

```bash
git clone https://github.com/danilo-guimaraes/refundflow.git
cd refundflow
```

### 2. Subir a API

```bash
cd api
npm install
npx prisma migrate dev   # cria o banco SQLite local
npm run dev               # http://localhost:3333
```

### 3. Subir o front-end (em outro terminal)

```bash
cd web
npm install
cp .env.example .env      # já aponta para http://localhost:3333
npm run dev                # http://localhost:5173
```

Pronto — cadastre um usuário, faça login e teste o fluxo completo.

> [!TIP]
> Para logar como **gestor** e ver o dashboard, cadastre o usuário direto pela API com `"role": "manager"` no corpo do `POST /users` (o formulário de cadastro do front-end sempre cria como `employee`).

## 🌐 Deploy

O front-end é publicado automaticamente no **GitHub Pages** a cada push na branch `main`, via GitHub Actions ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)).

Quer publicar sua própria cópia do zero (criar o repositório, configurar o Pages, etc.)? Veja o **[Guia de Deploy](./GUIDE.md)**.

> [!WARNING]
> Configurações como o segredo do JWT (`api/src/configs/auth.ts`) estão fixas no código só para fins de estudo. Num projeto real, isso deveria vir de variáveis de ambiente e nunca ser commitado.

## 🗺️ Melhorias futuras

- [ ] Mover segredos da API para variáveis de ambiente (`.env`)
- [ ] Publicar a API em um host com back-end (Render/Railway) e trocar SQLite por PostgreSQL
- [ ] Testes automatizados (API e front-end)
- [ ] Aprovação/rejeição de solicitações pelo gestor

## 👤 Autor

Feito por **[Danilo Guimarães](https://github.com/danilo-guimaraes)** — [LinkedIn](https://www.linkedin.com/in/daniloguimaraes-it/) · [d.guimaraes.dev@gmail.com](mailto:d.guimaraes.dev@gmail.com)

## 📝 Licença

Projeto de estudo, livre para fins educacionais.
