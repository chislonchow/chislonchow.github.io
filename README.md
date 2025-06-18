# Chislon Chow - Registered Psychotherapist Portfolio

This is a bilingual (English and Traditional Chinese) portfolio website for Chislon Chow, a Registered Psychotherapist. The site showcases professional information, services offered, articles, and contact details.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Content Management**: Markdown files for profile, FAQ, and articles.

## Key Features

- Bilingual support (English/Traditional Chinese) with client-side language switching.
- Static site generation (`output: 'export'`) for performance and deployability.
- Responsive design.
- Content pages (Profile, FAQ) and an Articles section driven by local Markdown files.

## Getting Started

The main entry point for the application is `src/app/page.tsx`. Content for specific pages like Profile, FAQ, and articles can be found in the `src/content/` and `src/lib/articles-data.ts` directories.

### Development

To run the development server:

```bash
npm run dev
```

### Build

To build the application for production (static export):

```bash
npm run build
```

The static files will be generated in the `out/` directory.

### Deployment to GitHub Pages

To deploy this Next.js application to GitHub Pages:

1.  **Build the Project**: Run `npm run build`. This will generate the static site in the `out/` directory.
2.  **Prepare `out/` Directory**:
    *   Navigate to the `out/` directory.
    *   Create an empty file named `.nojekyll` in the root of the `out/` directory. This file tells GitHub Pages to not run the site through Jekyll, which is important for Next.js static exports (especially for folders starting with `_`, like `_next/`).
3.  **Push to `gh-pages` Branch**:
    *   Push the *contents* of the `out/` directory (including the `.nojekyll` file and the `_next` folder) to the `gh-pages` branch of your GitHub repository. You can do this manually or set up a GitHub Action to automate this process.
    *   If your repository is named `<username>.github.io`, deploy to the `main` (or `master`) branch.
    *   If your repository is named something else (e.g., `my-portfolio`), and you want the site to be available at `https://<username>.github.io/my-portfolio/`, you would also need to configure the `basePath` property in `next.config.ts` to be `'/my-portfolio'`. (This change has not been made in the current configuration).
4.  **Configure GitHub Pages Source**: In your repository settings on GitHub, under "Pages", make sure the source for GitHub Pages is set to deploy from the `gh-pages` branch (or `main`/`master` if applicable) and the `/ (root)` folder.

The site should then be available at your GitHub Pages URL.
