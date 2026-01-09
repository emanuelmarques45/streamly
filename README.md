# 🎬 Streamly

**Streamly** é uma aplicação web desenvolvida com **Next.js** para explorar **filmes e séries** consumindo a API oficial do **TMDB (The Movie Database)**. O projeto possui layout inspirado em plataformas de streaming, com **listas horizontais por categoria**, páginas de detalhes e foco em **performance, organização de código e boas práticas modernas de frontend**.

---

## 🚀 Demonstração

> Deploy: **[https://seu-link.vercel.app](https://seu-link.vercel.app)**

---

## ✨ Funcionalidades

### 🎥 Filmes

- Listagem por categorias:

  - Populares
  - Top Avaliados
  - Em Cartaz
  - Em Breve

- Layout em carrossel horizontal (estilo Netflix)
- Navegação por páginas
- Página de detalhes do filme

### 📺 Séries

- Listagem por categorias:

  - Populares
  - Mais bem avaliadas
  - No ar
  - Exibindo hoje

- Layout em carrossel
- Página de detalhes da série

### ⚙️ Gerais

- Consumo de API real (TMDB)
- Skeleton loading
- Tratamento de erros
- Layout responsivo
- Transições suaves
- SEO básico com metadata

---

## 🧱 Stack utilizada

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Fetch API**
- **TMDB API**
- **Vercel (Deploy)**

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── signup/route.ts
│   │   └── movies/
│   │       ├── favorites/route.ts
│   │       ├── favorites/[movieId]/route.ts
│   │       └── search/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── profile/page.tsx
│   └── movies/
│       ├── error.tsx
│       └── [id]/
│           ├── page.tsx
│           └── loading.tsx
│
├── components/
│   ├── domain/
│   │   ├── MovieCard.tsx
│   │   ├── MovieRow.tsx
│   │   ├── MovieSearch.tsx
│   │   ├── TvShowCard.tsx
│   │   ├── TvShowRow.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── Pagination.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   └── ui/
│       ├── HeartIcon.tsx
│       └── Spinner.tsx
│
├── services/
│   ├── auth.ts
│   ├── movies.ts
│   ├── tv.ts
│   └── favorites.ts
│
├── types/
│   ├── Api.ts
│   ├── Movie.ts
│   ├── MovieCategory.ts
│   ├── TmdbResponse.ts
│   ├── TvShow.ts
│   └── TvShowCategory.ts
│
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── lib/
│   ├── jwt.ts
│   └── prisma.ts
│
├── utils/
│   ├── getQueryClient.tsx
│   ├── providers.tsx
│   ├── response.ts
│   └── safeJson.ts
│
├── constants/
│   └── index.ts
│
└── proxy.ts
```

---

## 🔌 API

Este projeto utiliza a API pública do **TMDB**.

📌 Documentação: [https://developer.themoviedb.org](https://developer.themoviedb.org)

### Endpoints usados

- `/movie/popular`
- `/movie/top_rated`
- `/movie/now_playing`
- `/movie/upcoming`
- `/tv/popular`
- `/tv/top_rated`
- `/tv/on_the_air`
- `/tv/airing_today`

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

### 3. Renomeie o arquivo `.env.example` para `.env`

```env
NEXT_PUBLIC_TMDB_API_KEY=SUA_CHAVE_AQUI
JWT_SECRET=SUA_CHAVE_AQUI
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📌 Decisões técnicas

- **Server Components** para busca de dados no servidor
- **Client Components** apenas onde há interatividade
- Services isolados para chamadas à API
- Componentes reutilizáveis (`Row`, `Grid`, `Card`)
- Uso de `flex-shrink` para carrosséis horizontais
- Layout mobile-first

---

## 🎯 Objetivo do projeto

Este projeto foi criado para:

- Demonstrar consumo de APIs reais
- Praticar arquitetura de componentes
- Simular um produto real
- Servir como projeto de portfólio

---

## 📈 Próximos passos (Roadmap)

- [ ] Página de temporadas e episódios
- [ ] Filtro por gênero

---

## 👨‍💻 Autor

**Emanuel Marques**

- GitHub: [https://github.com/emanuelmarques45](https://github.com/emanuelmarques45)
- LinkedIn: [https://www.linkedin.com/in/emanuel-marques-541617215/](https://www.linkedin.com/in/emanuel-marques-541617215/)
