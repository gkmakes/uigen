# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000) with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests with Vitest
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Force reset SQLite database
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## Architecture

**UIGen** is an AI-powered React component generator. Users describe a component in chat, Claude generates it using tool calls, and it renders live in a sandboxed iframe — all without touching the disk.

### Key Layers

**Virtual File System** (`src/lib/file-system.ts`)
In-memory tree structure. No disk I/O. Supports create/read/update/delete/rename and serializes to JSON for persistence. All generated code lives here.

**AI Integration** (`src/api/chat/route.ts` + `src/lib/provider.ts`)
- Streams responses from Claude (claude-haiku-4-5) via Vercel AI SDK
- Two AI tools: `str_replace_editor` (create/modify files) and `file_manager` (rename/delete)
- Falls back to a mock provider that generates static components when `ANTHROPIC_API_KEY` is not set
- System prompt lives in `src/lib/prompts/generation.tsx`

**Live Preview** (`src/components/preview/PreviewFrame.tsx`)
- Babel transforms JSX/TS in-browser
- Import map resolves external packages via esm.sh CDN
- Renders in a sandboxed iframe; entry point is `/App.jsx`
- CSS imports are stripped (not supported)

**State Management**
- `ChatContext` (`src/lib/contexts/`) — chat messages and streaming state
- `FileSystemContext` — virtual FS operations exposed to components

**Database** (Prisma + SQLite)
- Two models: `User` and `Project`
- Projects store `messages` and `data` (virtual FS) as JSON strings
- Projects can be anonymous (`userId` is nullable)
- Server actions in `src/actions/` handle all DB operations

**Auth** (`src/lib/auth.ts`)
- bcrypt for password hashing, JWT (HS256) for sessions
- HttpOnly cookie, 7-day expiration
- `JWT_SECRET` env var — defaults to `"development-secret-key"` in dev

### Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | Uses mock provider if absent |
| `JWT_SECRET` | No | Defaults to dev secret; set in production |

### Import Alias

`@/` maps to `src/`. Generated components should use `@/` for local imports and Tailwind CSS for styling.
