# Frequently Asked Questions

## How do I add a new page?

1. Create a new `.md` file in the `content/pages` directory
2. Run `npm run build` to generate the HTML
3. The page will be available at `/filename.html`

## How do I add a blog post?

1. Create a new `.md` file in the `content/blog` directory
2. Start with a title using `# Title`
3. Optionally add a date line: `date: 2024-01-01`
4. Run `npm run build` to generate the HTML
5. The post will be available at `/blog/filename.html`

## How do I customize the styling?

Edit the `assets/style.css` file. The styles are simple and easy to modify.

## How do I change the site name?

Edit the templates in the `templates` directory and update the "My Site" text.

## How do I run the site locally?

Run `npm run dev` to build and serve the site locally at `http://localhost:8000`.

