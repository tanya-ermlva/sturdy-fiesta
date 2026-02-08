# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site built with Next.js 16 (App Router), React 19, TypeScript 5.9, and Tailwind CSS 4.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm start` — Start production server
- `npm run lint` — Run ESLint (uses eslint-config-next)

No test framework is configured.

## Architecture

### Routing & Rendering

Next.js App Router with file-based routing. Pages in `app/`, API routes in `app/api/`. Components default to server components; client components must use `'use client'` directive.

### Component Organization

- `app/components/` — Page-specific components (Hero, ThemeToggle)
- `app/components/ui/` — Reusable UI primitives (Spotlight)
- `app/data/` — Static data (project list)
- `lib/utils.ts` — `cn()` helper combining `clsx` + `tailwind-merge`

### Styling & Theming

Tailwind CSS 4 with `@tailwindcss/postcss`. The theme system uses CSS custom properties defined in `app/globals.css`:

- **Color tokens**: 12-step scales for black, violet, white (e.g., `--black-1` through `--black-12`)
- **Semantic tokens**: `--background`, `--foreground`, `--surface-*`, `--accent-*`, `--border-*` with strength variants (strong, default, muted, subtle)
- **Dark mode**: `.dark` class on `<html>`, toggled via ThemeToggle with localStorage persistence
- **Theme flash prevention**: `app/theme-script.ts` exports an inline script that runs before hydration

Custom font: "Plain Medium" loaded from `/public/fonts/`.

### shadcn/ui

Configured via `components.json` (New York style, RSC enabled). Path alias `@/*` maps to project root. Uses `class-variance-authority` for component variants.

### Animations

Uses `motion` library (Framer Motion) for component animations. Custom Tailwind animations defined in `tailwind.config.ts`: `spotlight`, `bounce-slow`, `pulse-slow`.

### API Routes

Server-side only routes in `app/api/`. Environment variables (e.g., API keys) are accessed only server-side — never exposed to the browser. See `app/api/example/route.ts` for the pattern.

## Key Dependencies

- `motion` — Animation library (Framer Motion)
- `lucide-react` — Icon library
- `tailwind-merge` + `clsx` — Class merging via `cn()` utility
- `tailwindcss-animate` — Animation utilities for Tailwind

## Deployment

Optimized for Vercel deployment. `next.config.js` is minimal with no custom configuration needed.
