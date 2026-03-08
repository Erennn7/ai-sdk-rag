# AI SDK RAG

A full-stack **Retrieval-Augmented Generation (RAG)** application built with [Next.js](https://nextjs.org) and the [Vercel AI SDK](https://sdk.vercel.ai). Upload PDF documents and chat with their contents using OpenAI's /Anthropic's models and vector similarity search powered by [Neon Postgres](https://neon.tech) with `pgvector`.

---

## Features

- **PDF Upload** — Upload PDF files that are parsed, chunked, and embedded into a vector database.
- **Semantic Search** — At chat time the assistant automatically searches the knowledge base for relevant passages using cosine similarity.
- **Streaming Chat** — Real-time streamed responses via the Vercel AI SDK `streamText` API.
- **Authentication** — User authentication via [Clerk](https://clerk.com).
- **Agentic Tool Use** — The assistant decides when to call `searchKnowledgeBase` before answering, keeping responses grounded in uploaded documents.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| AI SDK | Vercel AI SDK v6 |
| LLM | OpenAI GPT-4o-mini |
| Embeddings | OpenAI `text-embedding-3-small` (1536 dims) |
| Database | Neon Postgres + `pgvector` |
| ORM | Drizzle ORM |
| Auth | Clerk |
| PDF Parsing | pdf-parse v2 | Langchain
| Text Splitting | LangChain `RecursiveCharacterTextSplitter` |
| Styling | Tailwind CSS v4 |

---

## Architecture

```
User uploads PDF
      │
      ▼
/upload (Server Action)
  1. Parse PDF text  (pdf-parse)
  2. Chunk text      (@langchain/textsplitters)
  3. Generate embeddings  (OpenAI text-embedding-3-small)
  4. Store chunks + embeddings  (Neon Postgres / pgvector)

User sends chat message
      │
      ▼
/api/chat (Streaming Route)
  1. Convert UI messages → model messages
  2. streamText with `searchKnowledgeBase` tool
  3. Tool searches vector DB using cosine similarity
  4. Model answers grounded in retrieved context
  5. Stream response back to client
```

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd ai-sdk-rag
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Neon Postgres (with pgvector enabled)
NEON_DATABASE_URL=postgres://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Enable pgvector on Neon

In the Neon console SQL editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

This creates the `documents` table with a `vector(1536)` column and an HNSW index for fast similarity search.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Navigate to **`/upload`** and select a PDF file. The app will parse, chunk, and embed it — you'll see a success message with the number of searchable chunks created.
2. Navigate to **`/chat`** and ask questions about the content of your uploaded documents. The assistant will automatically search the knowledge base and provide grounded answers.

---

## Project Structure

```
app/
  api/chat/route.ts      # Streaming chat endpoint with tool use
  chat/page.tsx          # Chat UI
  upload/
    page.tsx             # PDF upload UI
    actions.ts           # Server action: parse → chunk → embed → store

lib/
  db-config.ts           # Drizzle + Neon connection
  db-schema.ts           # documents table schema
  embeddings.ts          # OpenAI embedding helpers
  chunking.ts            # LangChain text splitter
  search.ts              # Vector similarity search

drizzle.config.ts        # Drizzle Kit config
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
