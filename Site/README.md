# Simple Static Site

A minimal static website generator that converts Markdown files to HTML. Perfect for landing pages, blogs, and simple content sites.

## Features

- ✅ Landing page
- ✅ Blog with Markdown posts
- ✅ About and FAQ pages
- ✅ Simple Markdown to HTML conversion
- ✅ Clean, modern styling
- ✅ No complex frameworks

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the site:**
   ```bash
   npm run build
   ```

3. **View locally:**
   ```bash
   npm run dev
   ```
   Then open http://localhost:8000 in your browser

## Project Structure

```
├── content/
│   ├── pages/          # Regular pages (index.md, about.md, faq.md)
│   └── blog/           # Blog posts
├── templates/          # HTML templates
├── assets/             # CSS and other static files
├── dist/               # Generated HTML files (created on build)
└── build.js            # Build script
```

## Adding Content

### Add a New Page

1. Create a `.md` file in `content/pages/`
2. Run `npm run build`
3. Access at `/filename.html`

### Add a Blog Post

1. Create a `.md` file in `content/blog/`
2. Start with a title: `# Your Post Title`
3. Optionally add a date: `date: 2024-01-15`
4. Run `npm run build`
5. Access at `/blog/filename.html`

## Customization

- **Styling**: Edit `assets/style.css`
- **Templates**: Edit files in `templates/`
- **Site Name**: Update "My Site" in the templates

## Deployment

After running `npm run build`, upload the `dist/` directory to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).
