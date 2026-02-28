<!--
████████████████████████████████████████████████████████████████████████████
  SOCIAL DEAL — BACKEND
  Strapi CMS · PostgreSQL · TypeScript · REST API
  Trabalho Académico · ISCTEM · Quirson Fernando Ngale
████████████████████████████████████████████████████████████████████████████
-->

<!-- HEADER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:060612,40:0f0a2e,100:4945ff&height=220&section=header&text=Social%20Deal%20%E2%80%94%20Backend&fontSize=55&fontColor=ffffff&fontAlignY=40&desc=Strapi%20CMS%20%7C%20PostgreSQL%20%7C%20REST%20API%20%7C%20TypeScript&descSize=17&descAlignY=62&animation=fadeIn" width="100%"/>

<div align="center">

```
 ██████╗  █████╗  ██████╗██╗  ██╗███████╗███╗   ██╗██████╗ 
 ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝████╗  ██║██╔══██╗
 ██████╔╝███████║██║     █████╔╝ █████╗  ██╔██╗ ██║██║  ██║
 ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║╚██╗██║██║  ██║
 ██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██║ ╚████║██████╔╝
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ 
          Social Deal — API & CMS Layer
```

<br/>

[![Strapi](https://img.shields.io/badge/Strapi_v5-4945FF?style=for-the-badge&logo=strapi&logoColor=white&labelColor=060612)](https://strapi.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=060612)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=060612)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=060612)](https://nodejs.org)
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white&labelColor=060612)](https://yarnpkg.com)

[![Part of](https://img.shields.io/badge/Projeto-Social_Deal-6366f1?style=for-the-badge&labelColor=060612)]()
[![Layer](https://img.shields.io/badge/Layer-Backend_/_API-4945ff?style=for-the-badge&labelColor=060612)]()
[![Frontend](https://img.shields.io/badge/Frontend_Repo-→_Social_Deal_Web-ec4899?style=for-the-badge&labelColor=060612)](https://github.com/Quirson/social-deal)

</div>

---

## `$ cat ABOUT.md`

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   Este repositório é a camada de Backend & API do projeto Social Deal — ║
║   uma rede social full-stack desenvolvida como trabalho académico        ║
║   no ISCTEM.                                                             ║
║                                                                          ║
║   Construído com Strapi CMS (v5), fornece uma REST API completa          ║
║   e um painel de administração para gerir todos os conteúdos             ║
║   da rede social — posts, utilizadores, comentários, mensagens.          ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## `$ cat ARCHITECTURE.md`

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOCIAL DEAL — FULLSTACK                     │
├──────────────────────────┬──────────────────────────────────────┤
│        FRONTEND          │             BACKEND                  │
│  Next.js · TypeScript    │  Strapi v5 · PostgreSQL              │
│  TailwindCSS · shadcn    │  REST API · Admin Panel              │
│                          │                                      │
│  github.com/Quirson/     │  github.com/Quirson/                 │
│  social-deal        ←────┼──── backend  ◄──── este repo        │
└──────────────────────────┴──────────────────────────────────────┘
          ↑                              ↑
     Consome a API              Expõe os endpoints
     em /api/...                  REST + Admin UI
```

</div>

---

## `$ curl /api --list-endpoints`

```
📢  POSTS
GET     /api/posts              → Listar todos os posts
POST    /api/posts              → Criar novo post
GET     /api/posts/:id          → Detalhe de um post
PUT     /api/posts/:id          → Atualizar post
DELETE  /api/posts/:id          → Eliminar post

👤  UTILIZADORES
GET     /api/users              → Listar utilizadores
GET     /api/users/:id          → Perfil de utilizador
PUT     /api/users/:id          → Atualizar perfil

❤️  LIKES & COMENTÁRIOS
GET     /api/comments?post=:id  → Comentários de um post
POST    /api/comments           → Criar comentário
POST    /api/likes              → Dar like num post
DELETE  /api/likes/:id          → Remover like

💬  MENSAGENS
GET     /api/messages?user=:id  → Mensagens de um utilizador
POST    /api/messages           → Enviar mensagem

🔐  AUTENTICAÇÃO (Strapi Users & Permissions)
POST    /api/auth/local/register → Registar utilizador
POST    /api/auth/local          → Login → retorna JWT token
GET     /api/users/me            → Dados do utilizador atual
```

---

## `$ tree ./src`

```
backend/
├── src/
│   ├── api/                    ← Content Types (Strapi)
│   │   ├── post/               ← Posts da rede social
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── comment/            ← Comentários
│   │   ├── like/               ← Likes
│   │   ├── message/            ← Mensagens privadas
│   │   └── follow/             ← Sistema de follows
│   ├── extensions/             ← Extensões do Strapi
│   └── middlewares/            ← Middlewares customizados
├── config/
│   ├── database.ts             ← Configuração PostgreSQL
│   ├── server.ts               ← Porta e host
│   ├── middlewares.ts          ← CORS, rate limit
│   └── plugins.ts              ← Plugins ativos
├── database/
│   └── migrations/             ← Migrações do DB
├── types/generated/            ← TypeScript types gerados
├── dist/                       ← Build compilado
├── public/                     ← Assets públicos
├── dump.sql                    ← Dump da base de dados
└── .strapi/                    ← Cache interno Strapi
```

---

## `$ cat DATABASE.md`

```sql
-- dump.sql — PostgreSQL Schema (Social Deal)

-- Posts
CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  author_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Comentários
CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  body       TEXT NOT NULL,
  post_id    INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Likes
CREATE TABLE likes (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

-- Follows
CREATE TABLE follows (
  follower_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);

-- Mensagens
CREATE TABLE messages (
  id          SERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  sender_id   INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  read        BOOLEAN DEFAULT FALSE,
  sent_at     TIMESTAMP DEFAULT NOW()
);
```

---

## `$ yarn setup`

```bash
# 1. Clonar o repositório
git clone https://github.com/Quirson/backend.git
cd backend

# 2. Instalar dependências
yarn install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# .env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=social_deal
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false

APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=your_salt
ADMIN_JWT_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret

# 4. Restaurar o dump da base de dados (opcional)
psql -U postgres -d social_deal < dump.sql

# 5. Iniciar em modo desenvolvimento
yarn develop
# → http://localhost:1337
# → Admin Panel: http://localhost:1337/admin

# 6. Build para produção
yarn build && yarn start
```

---

## `$ strapi --info`

<div align="center">

| Propriedade | Valor |
|:-----------:|:------|
| 🚀 Framework | Strapi v5 |
| 🗄️ Database | PostgreSQL |
| 🔐 Auth | Strapi Users & Permissions Plugin |
| 🌐 API | REST (JSON) |
| 📊 Admin | Strapi Admin Panel — `/admin` |
| 📦 Package Manager | Yarn |
| 🏗️ Language | TypeScript |
| 🔗 Frontend | [Social Deal Web](https://github.com/Quirson/social-deal) |

</div>

---

## `$ git log --author="Quirson"`

<div align="center">

```
commit ad0035c — Actualizacao Do Backend     (3 months ago)
commit b4f21e1 — Actualizacao do Banco de Dados (4 months ago)
commit 8c9d3a2 — Initial commit              (5 months ago)

Author:      Quirson Fernando Ngale
Institution: ISCTEM — Engenharia Informática
Project:     Social Deal (Backend Layer)
Year:        2024
```

<br/>

**Desenvolvido com 💜 por [Quirson Fernando Ngale](https://github.com/Quirson)**

[![Frontend Repo](https://img.shields.io/badge/🔗_Frontend-Social_Deal_Web-6366f1?style=for-the-badge&labelColor=060612)](https://github.com/Quirson/social-deal)
[![Portfolio](https://img.shields.io/badge/Portfolio-quirsonngale.dev-4945ff?style=for-the-badge&labelColor=060612)](https://www.quirsonngale.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=060612)](https://www.linkedin.com/in/quirson-fernando-ngale)
[![GitHub](https://img.shields.io/badge/GitHub-@Quirson-ffffff?style=for-the-badge&logo=github&logoColor=white&labelColor=060612)](https://github.com/Quirson)

*Engenharia Informática · ISCTEM · Maputo, Moçambique 🇲🇿*

</div>

<!-- FOOTER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4945ff,40:0f0a2e,100:060612&height=120&section=footer" width="100%"/>
