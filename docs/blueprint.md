
# Serene Mind Studio - Application Blueprint

This document outlines the architecture and functionality of the Serene Mind Studio web application, reflecting its state as of commit `942d5df2`.

## 1. Overall Architecture

The application is built using Next.js with the App Router, TypeScript, and Tailwind CSS. It's designed as a bilingual (English and Traditional Chinese) static website for a psychotherapy practice.

- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, ShadCN UI components
- **UI Library**: React
- **State Management**: React Context API (primarily for language)
- **Content**: Primarily Markdown files and structured data within TypeScript files.

## 2. Core Functionality

### 2.1. Internationalization (i18n)

- **Languages Supported**: English (default) and Traditional Chinese.
- **URL Structure**:
    - English: Root paths (e.g., `/`, `/profile`, `/articles`)
    - Chinese: Prefixed with `/zh/` (e.g., `/zh`, `/zh/profile`, `/zh/articles`)
- **Language Context**:
    - `src/contexts/language-context.tsx`: Manages the current language (`en` or `zh`) and provides access to translated strings.
    - `LanguageProvider`: Wraps the entire application in `src/app/layout.tsx`.
- **Language Setting**:
    - `src/components/shared/language-setter.tsx`: This component is placed on each individual page (both English and Chinese versions). It receives a `lang` prop and calls `setLanguage` from the context to update the application's language state based on the current page's language.
- **Language Toggle**:
    - `src/components/shared/language-toggle.tsx`: A button in the header that allows users to switch between English and Chinese versions of the current page by navigating to the corresponding URL.
- **Translations**:
    - Stored in `src/lib/translations.ts` and its imported modules (e.g., `translations-home.ts`, `translations-articles.ts`). Translations are plain JavaScript objects mapping keys to language-specific strings.

### 2.2. Content Pages

All content pages are available in both English and Traditional Chinese.

- **Homepage**:
    - Files: `src/app/page.tsx` (English), `src/app/zh/page.tsx` (Chinese)
    - Client Component: `src/app/home/home-page-client-contents.tsx` renders the main content.
    - Features: Hero section with clinician name and call-to-action, welcome/approach text, network affiliations, mental health crisis information, and a CTA to view articles.
    - Layout: Full-width header, distinct content sections.
- **Profile Page**:
    - Files: `src/app/profile/page.tsx` (English), `src/app/zh/profile/page.tsx` (Chinese)
    - Content Source: Markdown files (`src/content/en/profile.md`, `src/content/zh/profile.md`).
    - Layout: Uses `src/components/shared/content-page-client-layout.tsx` to display a title and the processed Markdown content.
- **FAQ Page**:
    - Files: `src/app/faq/page.tsx` (English), `src/app/zh/faq/page.tsx` (Chinese)
    - Content Source: Markdown files (`src/content/en/faq.md`, `src/content/zh/faq.md`).
    - Layout: Similar to the Profile page, using `ContentPageClientLayout`.
- **Articles List Page**:
    - Files: `src/app/articles/page.tsx` (English), `src/app/zh/articles/page.tsx` (Chinese)
    - Client Component: `src/components/articles/article-list-client.tsx` fetches article data and handles rendering, filtering, sorting, and pagination.
    - Features: Displays articles in a card layout. Allows filtering by category and sorting by pinned status and title (A-Z/Z-A).
    - Data Source: `src/lib/articles-data.ts`.
- **Individual Article Page**:
    - Files: `src/app/articles/[slug]/page.tsx` (English), `src/app/zh/articles/[slug]/page.tsx` (Chinese)
    - Features: Displays the title, description, categories, update date, and full Markdown content of a single article.
    - Data Source: `src/lib/articles-data.ts`.

### 2.3. Layout and Navigation

- **Root Layout**: `src/app/layout.tsx`
    - Wraps all pages.
    - Includes `LanguageProvider`, `Header`, `Footer`, `ContactPopover`, and `Toaster`.
    - Loads Google Fonts (`Noto Sans TC`, `Noto Serif TC`) via `<link>` tags.
- **Header**: `src/components/layout/header.tsx`
    - Displays site name/logo.
    - Contains primary navigation links (Home, Profile, FAQ, Articles).
    - Includes the `LanguageToggle` component.
    - Responsive: Uses a sheet (drawer) for mobile navigation.
- **Footer**: `src/components/layout/footer.tsx`
    - Contains social media icons (placeholders), email contact, a disclaimer, and copyright information.
- **Contact Popover**: `src/components/shared/contact-popover.tsx`
    - A floating action button that opens a popover displaying contact details and a profile image.
- **Toaster**: `src/components/ui/toaster.tsx` (and `use-toast` hook)
    - Used for displaying brief, non-intrusive notifications (primarily intended for errors).

## 3. Styling and UI

- **CSS Framework**: Tailwind CSS.
- **UI Components**: ShadCN UI.
    - Pre-built components are located in `src/components/ui/`.
    - Custom components are in `src/components/shared/`, `src/components/layout/`, etc.
- **Global Styles**: `src/app/globals.css`
    - Defines Tailwind base layers, components, utilities.
    - Contains the ShadCN theme (CSS HSL variables for colors like background, primary, accent).
    - Includes base styling for Markdown-rendered content (`.markdown-content`).
- **Fonts**:
    - Menu Font: 'Noto Sans TC' (sans-serif)
    - Body Font: 'Noto Serif TC' (serif)
    - Loaded via `<link>` tags in `src/app/layout.tsx`.
- **Responsive Design**: The application is designed to be responsive across various screen sizes.

## 4. Content Management

- **Markdown**: Profile and FAQ page content is managed via Markdown files in `src/content/[lang]/[pageType].md`.
- **Article Data**: Article metadata (titles, descriptions, slugs, categories, pinned status) and their Markdown content are stored in a structured array within `src/lib/articles-data.ts`.
- **Markdown Processing**:
    - `src/components/shared/markdown-display.tsx`: A server component that reads Markdown content (either from a file or a direct string), processes it using `remark`, `remark-html`, and `remark-behead` (to adjust heading levels), and renders it as HTML.
- **Translations**: Static text and UI labels are managed via JavaScript objects in `src/lib/translations.ts` and its associated files.

## 5. Key Technologies and Libraries

- **Next.js**: React framework for server-side rendering, static site generation, routing.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript adding static typing.
- **Tailwind CSS**: Utility-first CSS framework.
- **ShadCN UI**: Collection of re-usable UI components.
- **Lucide Icons**: Icon library.
- **`remark` / `remark-html` / `remark-behead`**: Markdown processing.
- **`date-fns`**: Date formatting.
- **`clsx` / `tailwind-merge`**: Utility for constructing CSS class names.

## 6. Build and Deployment

- **Build Mode**: The `next.config.ts` specifies `output: 'export'`, indicating the application is built as a fully static site. This is suitable for deployment on static hosting platforms.
- **Scripts**:
    - `npm run dev`: Starts the development server.
    - `npm run build`: Builds the application for production (static export).
    - `npm run start`: Starts a production server (less relevant with `output: 'export'`).

## 7. Current SEO Implementation (as of `942d5df2`)

- **Metadata**: Each page uses `generateMetadata` to define its `title` and `description`.
- **HTML Lang Attribute**: The `<html>` tag in `src/app/layout.tsx` is hardcoded to `lang="en"`.
- **Missing Features**:
    - No `metadataBase` is set.
    - No `canonical` URLs are specified.
    - No `hreflang` alternate links for different language versions are implemented.
    - The Chinese pages will inherit `lang="en"` from the root layout.

This blueprint provides a snapshot of the application's structure and capabilities. It can be updated as the project evolves.
