# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio and blog for Ram Loganda. It started from the `leerob/next-mdx-blog` template (the README is still the template's). Stack: Next.js 16 App Router with Turbopack, MDX pages, Tailwind CSS v4, React 19, deployed on Vercel.

## Commands

Use **npm**. The lockfile is `package-lock.json`, even though the README says pnpm.

- `npm run dev`: dev server (Turbopack)
- `npm run build`: production build. This is also the main correctness check because it prerenders every page and the sitemap.
- `npm start`: serve the production build
- `npx tsc --noEmit`: typecheck

There is no linter and no test suite.

## Architecture

**Content is MDX routes.** `next.config.ts` sets `pageExtensions: ['mdx', 'ts', 'tsx']`, so every `page.mdx` is a route.
- `app/page.mdx` is the home page. Its list of links is the blog index.
- Each post lives at `app/blogs/<slug>/page.mdx`. Nothing serves `/blogs` itself.
- A post starts with `export const metadata = { title, alternates: { canonical: '/blogs/<slug>' } }`, then `# Title`, then `<br />`. The layout adds `| Ram Loganda` to every title.
- Posts import React components with the `@/` alias, which points to the repo root. Example: `<ProjectGrid />` in `blogs/portfolio`.

**MDX compiles with the Rust compiler.** `experimental.mdxRs` (GFM) is on, so remark/rehype plugins cannot be used. Element styling comes from `mdx-components.tsx`, which maps markdown elements to Tailwind-styled components for every page:
- Code is highlighted with `sugar-high`.
- Internal links use `next/link`, and external links open in a new tab.
- Markdown images get the `wide` class.
- A `<Table data={{headers, rows}} />` component is available.

**Layout and width.** `app/layout.tsx` renders:
- the theme toggler
- `SiteDock`, the fixed bottom navigation
- a single `max-w-[60ch]` content column

Content that should be wider than the text column uses the `wide` utility from `app/globals.css`, with the width set through `--wide-width`.

**Theming.** Dark mode is class-based:
- An inline script in `layout.tsx` adds `.dark` to `<html>` from `localStorage.theme` or the system setting.
- `@custom-variant dark` in `globals.css` makes the `dark:` variants follow that class.
- Style with the gray/zinc palette plus `dark:` variants.
- `<html>` and `<body>` have `suppressHydrationWarning` because of the theme script and browser extensions such as Grammarly. Keep it.

**shadcn/ui** was set up by hand, without `shadcn init`, so the custom `globals.css` is not overwritten.
- `components.json` lets `npx shadcn@latest add <component>` work, and generated files go in `components/ui/`.
- The generated code imports `cn` from the `cn` npm package, not from `@/lib/utils` (which does not exist).
- `globals.css` defines only some shadcn colour tokens: background, foreground, primary, secondary, accent, destructive, border, input and ring, with `.dark` overrides and an `@theme inline` mapping.
- If a new shadcn component uses a token that isn't defined (for example `muted`, `card` or `popover`), add it in all three places. Otherwise its colour classes produce no CSS.

**Other moving parts**
- `app/sitemap.ts` scans `app/blogs/**/page.mdx`. New posts appear in it automatically. If you move or rename the posts folder, update this file or the build fails.
- `next.config.ts` can load redirects from a Postgres `redirects` table through `POSTGRES_URL`. It returns no redirects when that variable is unset, which is the normal local setup.
- `experimental.agentUpgrade: 'security'` in `next.config.ts` is intentional.
- Static files go in `public/`, and per-post images in `public/blogs/<slug>/`. `components/photo-carousel.tsx` shows a placeholder for images that haven't been uploaded yet.
- `components/project-card.tsx` contains mock project data.
- `SITE_URL` in `app/sitemap.ts` and `metadataBase` in `app/layout.tsx` still point to the template domain `next-mdx-blog.vercel.app`.
