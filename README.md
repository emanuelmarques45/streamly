# 🎬 Streamly

**Streamly** é uma aplicação web feita com **Next.js (App Router)** para explorar **filmes e séries** usando a API do **TMDB**. O layout é inspirado em plataformas de streaming: destaque na home, listas horizontais por categoria, página de descoberta com filtros, páginas de detalhe com elenco e trailer, e uma lista pessoal de favoritos.

---

## 🚀 Demonstração

> Deploy: **[https://streamly-iota.vercel.app/](https://streamly-iota.vercel.app/)**

---

## ✨ Funcionalidades

### 🏠 Home

- Destaque (hero) com o título mais popular da semana
- Carrossel "Em alta esta semana" (filmes + séries)
- Listas horizontais por categoria com **scroll infinito** e setas de navegação

### 🎥 Filmes e 📺 Séries

- Categorias: populares, mais bem avaliados, em cartaz, em breve, no ar, exibindo hoje
- Página de detalhes com backdrop, sinopse, gêneros, duração, nota e contagem de votos
- **Elenco principal**, **trailer** (modal com player sob demanda) e **recomendações**
- Séries: **seletor de temporadas** que carrega os episódios da temporada escolhida

### 🔎 Descobrir (`/discover`)

- Filtro por **gênero** (múltipla seleção), **ano** e **ordenação**
- Alternância entre filmes e séries
- Estado inteiramente na URL — a combinação de filtros é compartilhável
- Grade com scroll infinito

### 🔍 Busca

- **Multi-search**: filmes e séries no mesmo dropdown
- Debounce, cache e cancelamento de requisições
- Navegação por teclado (`↑` `↓` `Enter` `Esc`) e atalho `/` para focar

### ❤️ Conta e favoritos

- Cadastro/login com JWT em cookie `httpOnly`
- Favoritar filmes e séries direto do card ou da página de detalhe
- **Toggle otimista** com rollback em caso de erro
- Página de favoritos com remoção instantânea

### ⚙️ Gerais

- Tema claro/escuro com preferência do sistema e **sem flash** no carregamento
- Skeletons, error boundaries e páginas 404 dedicadas
- SEO: metadata por página, OpenGraph, `sitemap.xml` e `robots.txt`
- Acessibilidade: skip link, foco visível, `aria-*` nos componentes interativos
- Layout responsivo e suporte a `prefers-reduced-motion`

---

## 🧱 Stack

- **Next.js 16 (App Router)** + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **TanStack Query** (cache, scroll infinito, mutations otimistas)
- **Prisma + PostgreSQL**
- **JWT** + **bcrypt**
- **TMDB API**
- **Vercel** (deploy)

---

## 🔐 Arquitetura de acesso ao TMDB

O browser **nunca** fala com o TMDB diretamente. O token vive só no servidor:

```
Client Component
   └─ services/catalog.client.ts   →  /api/catalog/*   →  lib/tmdb.ts  →  TMDB
                                       (Route Handler)     (token aqui)
```

- `src/lib/tmdb.ts` é o único ponto que lê `TMDB_TOKEN` e monta os headers.
- As rotas em `src/app/api/catalog/*` validam os parâmetros e aplicam `Cache-Control`.
- Server Components chamam os serviços (`services/movies.ts`, `tv.ts`, `catalog.ts`) direto.

> ⚠️ Não use `NEXT_PUBLIC_TMDB_TOKEN`: qualquer variável `NEXT_PUBLIC_*` referenciada em um módulo que chega ao cliente é **inlinada no bundle do browser**.

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                  # home (hero + linhas)
│   ├── layout.tsx                # metadata, tema sem flash, skip link
│   ├── error.tsx / not-found.tsx
│   ├── sitemap.ts / robots.ts
│   ├── discover/                 # busca por gênero, ano e ordenação
│   ├── movies/[id]/ , tvs/[id]/  # detalhes + loading + error
│   ├── login/ , signup/ , profile/
│   └── api/
│       ├── auth/{login,logout,me,signup}/route.ts
│       ├── favorites/route.ts , favorites/[itemId]/route.ts
│       └── catalog/
│           ├── list/route.ts     # categorias de filmes e séries
│           ├── search/route.ts   # multi-search
│           ├── discover/route.ts
│           ├── genres/route.ts
│           └── tv/[id]/seasons/[season]/route.ts
│
├── components/
│   ├── domain/
│   │   ├── Hero.tsx  MediaDetail.tsx  DetailSkeleton.tsx
│   │   ├── MediaCard.tsx  MediaRow.tsx  MediaCarousel.tsx  MediaScroller.tsx
│   │   ├── MediaSearch.tsx  DiscoverFilters.tsx  DiscoverResults.tsx
│   │   ├── CastRow.tsx  TrailerDialog.tsx  SeasonPicker.tsx  EpisodeList.tsx
│   │   ├── FavoriteButton.tsx  FavoriteRow.tsx  ItemPoster.tsx  CardSkeleton.tsx
│   │   └── LoginForm.tsx  SignupForm.tsx
│   ├── layout/  (Header, Footer, Container)
│   └── ui/      (HeartIcon, Spinner, RatingBadge, ErrorState)
│
├── hooks/useFavorites.ts         # fonte única dos favoritos no cliente
├── lib/       (tmdb.ts, prisma.ts, jwt.ts, queryKeys.ts)
├── services/  (movies, tv, catalog, catalog.client, auth, favorites, favorites.client)
├── types/     (Media, Movie, TvShow, Credits, Video, Genre, Favorite, Api, TmdbResponse)
├── context/   (AuthContext, ThemeContext)
├── utils/     (format, params, redirect, response, safeJson, providers, getQueryClient)
├── constants/
└── proxy.ts                      # protege /profile
```

---

## 🔌 API do TMDB

📌 Documentação: [https://developer.themoviedb.org](https://developer.themoviedb.org)

Endpoints usados: `/trending/*`, `/movie/{categoria}`, `/tv/{categoria}`, `/movie/{id}`, `/tv/{id}` (com `append_to_response=credits,videos,recommendations`), `/tv/{id}/season/{n}`, `/discover/{movie,tv}`, `/genre/{tipo}/list`, `/search/multi`.

---

## 🛠️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/emanuelmarques45/streamly.git
cd streamly
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Copie `.env.example` para `.env` e preencha:

```env
APP_URL=http://localhost:5173
TMDB_TOKEN=seu_token_de_leitura_v4
JWT_SECRET=sua_chave
DATABASE_URL=postgresql://user:password@localhost:5432/streamly
```

### 4. Prepare o banco

```bash
npx prisma migrate dev
```

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📌 Decisões técnicas

- **Server Components** buscam dados; Client Components só onde há interatividade
- Token do TMDB isolado em `lib/tmdb.ts`, com revalidação por tipo de recurso
- Componentes de mídia unificados (`MediaCard`, `MediaRow`) em vez de duplicar filme/série
- Estado de filtros na URL; estado de servidor no TanStack Query
- Envelope `ApiResponse` consistente, com o status HTTP correto na resposta
- Posters em `w342` nos cards (em vez de `original`) para reduzir o peso das listas
- Sem `loading.tsx` nas páginas de detalhe: o arquivo cria um boundary que envia o
  shell antes de o `notFound()` resolver, e títulos inexistentes viravam **soft-404**
  (HTTP 200). O feedback de carregamento fica no próprio card, via `useTransition`.

---

## 🎯 Objetivo do projeto

- Demonstrar consumo de APIs reais
- Praticar arquitetura de componentes
- Simular um produto real
- Servir como projeto de portfólio

---

## 📈 Próximos passos (Roadmap)

- [x] Página de temporadas e episódios
- [x] Filtro por gênero
- [ ] Página de pessoa (ator/diretor) com filmografia
- [ ] Watchlist separada de "favoritos"
- [ ] Testes automatizados (Vitest + Testing Library)

---

## 👨‍💻 Autor

**Emanuel Marques**

- GitHub: [https://github.com/emanuelmarques45](https://github.com/emanuelmarques45)
- LinkedIn: [https://www.linkedin.com/in/emanuel-marques-541617215/](https://www.linkedin.com/in/emanuel-marques-541617215/)

---

Este produto usa a API do TMDB, mas não é endossado nem certificado por ele.
