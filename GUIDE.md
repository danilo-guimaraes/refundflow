<p align="center"><a href="./README.md">⬅ Voltar para o README do RefundFlow</a></p>

# 📘 Guia: do zero ao GitHub Pages

Passo a passo completo para pegar este projeto (ou qualquer projeto React + Vite parecido) do seu computador, subir num repositório novo no GitHub e publicar o front-end no GitHub Pages com deploy automático.

> [!NOTE]
> Este guia documenta exatamente os passos usados para publicar o **RefundFlow**. Veja a visão geral do projeto no [README](./README.md).

## Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Criar o repositório no GitHub](#2-criar-o-repositório-no-github)
3. [Rodando a API localmente](#3-rodando-a-api-localmente)
4. [Subir o código (git init, commit, push)](#4-subir-o-código-git-init-commit-push)
5. [Publicar o front-end no GitHub Pages](#5-publicar-o-front-end-no-github-pages)
6. [Como o deploy automático funciona](#6-como-o-deploy-automático-funciona)
7. [Problemas comuns](#7-problemas-comuns)

---

## 1. Pré-requisitos

- [Git](https://git-scm.com/) instalado
- Conta no [GitHub](https://github.com/)
- [Node.js](https://nodejs.org/) 20+ e npm
- (Opcional, mas recomenda) [GitHub CLI (`gh`)](https://cli.github.com/) — evita ficar trocando de terminal pro navegador

## 2. Criar o repositório no GitHub

**Opção A — pelo site**

1. Acesse [github.com/new](https://github.com/new)
2. Escolha um nome (ex.: `refundflow`)
3. Deixe **público** (senão o GitHub Pages gratuito não funciona) e **não** marque "Add a README" (o projeto já vai ter um)
4. Clique em **Create repository** e guarde a URL que aparecer (`https://github.com/<seu-usuario>/refundflow.git`)

**Opção B — pelo terminal, com `gh`**

```bash
gh repo create <seu-usuario>/refundflow --public --description "Sistema fullstack de reembolsos corporativos"
```

## 3. Rodando a API localmente

O GitHub Pages só publica arquivos estáticos — ele não roda Node.js. Então, pra usar o RefundFlow com login/cadastro/upload funcionando de verdade, a API precisa estar rodando (seja na sua máquina, seja em outro serviço). Localmente:

```bash
cd api
npm install
npx prisma migrate dev
npm run dev              # http://localhost:3333
```

> [!TIP]
> Se um dia você quiser a demo publicada 100% funcional (sem precisar rodar nada localmente), o próximo passo é publicar a pasta `api/` em um serviço que roda back-end, como o [Render](https://render.com/) ou [Railway](https://railway.app/), e apontar `VITE_API_URL` (passo 5) pra URL dele em vez do `localhost`.

## 4. Subir o código (git init, commit, push)

Na raiz do projeto (a pasta que contém `api/` e `web/`):

```bash
# 1. Iniciar o repositório Git local
git init

# 2. Adicionar os arquivos (o .gitignore já cuida de node_modules, dist, .env, banco local etc.)
git add .

# 3. Primeiro commit
git commit -m "chore: primeira versão do RefundFlow"

# 4. Conectar ao repositório criado no passo 2
git branch -M main
git remote add origin https://github.com/<seu-usuario>/refundflow.git

# 5. Enviar
git push -u origin main
```

> [!IMPORTANT]
> Confira o `git status` antes do `git add .` — o `.gitignore` da raiz já ignora `node_modules`, `.env`, o banco SQLite (`api/prisma/dev.db`) e os comprovantes enviados em `api/tmp/uploads`. Isso evita subir arquivo grande, segredo ou dado de teste sem querer.

## 5. Publicar o front-end no GitHub Pages

1. No GitHub, abra o repositório → **Settings** → **Pages**
2. Em **Build and deployment → Source**, escolha **GitHub Actions**
3. Pronto. O workflow em [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) já está no repositório e roda automaticamente a cada push na `main`

Se quiser publicar a API em outro serviço (passo 3) e ligar o front-end publicado a ela, defina a variável `VITE_API_URL` como um **secret/variável de ambiente do repositório** (Settings → Secrets and variables → Actions) e adicione no step de build do workflow:

```yaml
- name: Build
  working-directory: web
  run: npm run build
  env:
    VITE_API_URL: ${{ vars.VITE_API_URL }}
```

Sem isso, o front-end publicado usa o valor padrão (`http://localhost:3333`), que só existe na sua máquina.

## 6. Como o deploy automático funciona

O workflow [`deploy.yml`](./.github/workflows/deploy.yml) faz, a cada push que muda algo em `web/`:

1. Instala as dependências do `web/` (`npm ci`)
2. Builda o projeto (`npm run build` → gera `web/dist`)
3. Copia `index.html` para `404.html` — truque necessário porque o React Router usa rotas do lado do cliente, e o GitHub Pages precisa de um `404.html` pra não quebrar quando alguém recarrega a página numa rota como `/signup`
4. Publica o conteúdo de `web/dist` no GitHub Pages

Depois do primeiro deploy, a URL fica em **Settings → Pages** (formato `https://<seu-usuario>.github.io/refundflow/`).

## 7. Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Página em branco no Pages | `base` do Vite não bate com o nome do repositório | Confira `vite.config.ts` — `base` precisa ser `/<nome-do-repo>/` |
| 404 ao recarregar uma rota (ex. `/signup`) | GitHub Pages não conhece rotas client-side | Já resolvido pelo `404.html` do workflow (passo 6) — confirme que o step existe |
| Login/cadastro não funcionam na demo publicada | A API não está rodando em lugar nenhum acessível pela internet | Rode a API localmente (passo 3) ou publique-a e configure `VITE_API_URL` (passo 5) |
| Aba **Pages** não aparece em Settings | Repositório está **privado** num plano sem Pages liberado | Torne o repositório público, ou libere o GitHub Pages no plano da conta |
| Workflow falha no `npm ci` | `package-lock.json` não foi commitado | Confirme que `web/package-lock.json` está no repositório (ele não deve estar no `.gitignore`) |

---

<p align="center"><a href="./README.md">⬅ Voltar para o README do RefundFlow</a></p>
