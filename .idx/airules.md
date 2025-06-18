
# AI Coding Partner Guidelines for This Project

This document outlines specific rules and conventions to follow when assisting with this NextJS application.

## General Text and Content

*   **Apostrophes (General Text):** Use standard apostrophes (`'`) instead of typographic ones (`’`) in all generated text content (e.g., in Markdown descriptions, UI text).
*   **Canadian Spelling:** Prioritize Canadian English spelling conventions (e.g., "colour" instead of "color", "centre" instead of "center", "honour" instead of "honor").

## Code Generation (NextJS, React, Tailwind, ShadCN)

*   Adhere to the predefined tech stack (NextJS, React, ShadCN, Tailwind).
*   Follow Next.js App Router, Server Components, TypeScript with `import type`, and Server Actions best practices.
*   Optimize images with `next/image` and use `https://placehold.co/` for placeholders, including `data-ai-hint` for image search keywords (max two words).
*   Prioritize clean, readable, well-organized, and performant code. Avoid adding comments to `package.json` or generated code unless specifically part of the request.
*   Handle client-side specific values (e.g., `Math.random()`, `new Date()`, `window`) within `useEffect` to prevent hydration errors.
*   Prefer ShadCN components and use Tailwind CSS with semantic classes.
*   Rely on the theme in `globals.css` for colors; do not override Tailwind color classes directly.
*   Use `lucide-react` for icons, double-checking availability. Use inline SVGs for unsupported icons.

## Styling Guidance
* Reference best practices for styling from *Refactoring UI* by Adam Wathan and Steve Schoger.