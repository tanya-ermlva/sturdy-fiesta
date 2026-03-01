# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 16 portfolio site. Single service — no databases, Docker, or external dependencies required.

### Running the app

- `npm run dev` starts the dev server on port 3000 (Turbopack).
- See `CLAUDE.md` and `README.md` for all available scripts.

### Known caveats

- **Linting**: The `npm run lint` script calls `next lint`, which was removed in Next.js 16. ESLint 9 is installed but no `eslint.config.js` exists, so `npx eslint .` also fails. Linting is currently non-functional until an `eslint.config.js` is added.
- **No test framework**: No test runner is configured. There are no automated tests to run.
- **Environment variables**: `.env.local` is optional. The API route at `/api/example` works without any keys. See `.env.local.example` for optional placeholders.
