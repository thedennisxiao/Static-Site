const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const config = {
  contentDir: './content',
  pagesDir: './content/pages',
  blogDir: './content/blog',
  outputDir: './dist',
  templateDir: './templates'
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Read template file
function readTemplate(templateName) {
  return fs.readFileSync(
    path.join(config.templateDir, `${templateName}.html`),
    'utf-8'
  );
}

// Process Markdown file
function processMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return marked.parse(content);
}

// Build a page
function buildPage(markdownFile, outputFile, template = 'page') {
  const htmlContent = processMarkdown(markdownFile);
  const templateContent = readTemplate(template);
  
  // Extract title from first h1 if available
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
  const pageTitle = titleMatch ? titleMatch[1] : 'Page';
  
  const finalHtml = templateContent
    .replace('{{TITLE}}', pageTitle)
    .replace('{{CONTENT}}', htmlContent);
  
  fs.writeFileSync(outputFile, finalHtml, 'utf-8');
  console.log(`Built: ${outputFile}`);
}

// Build blog index
function buildBlogIndex() {
  if (!fs.existsSync(config.blogDir)) {
    return;
  }
  
  const blogFiles = fs.readdirSync(config.blogDir)
    .filter(file => file.endsWith('.md'))
    .sort()
    .reverse(); // Most recent first
  
  let blogListHtml = '<div class="blog-list">';
  
  blogFiles.forEach(file => {
    const filePath = path.join(config.blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const dateMatch = content.match(/^date:\s*(.+)$/m);
    
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
    const date = dateMatch ? dateMatch[1] : '';
    const slug = file.replace('.md', '');
    
    blogListHtml += `
      <article class="blog-preview">
        <h2><a href="/blog/${slug}.html">${title}</a></h2>
        ${date ? `<p class="blog-date">${date}</p>` : ''}
      </article>
    `;
  });
  
  blogListHtml += '</div>';
  
  const templateContent = readTemplate('page');
  const finalHtml = templateContent
    .replace('{{TITLE}}', 'Blog')
    .replace('{{CONTENT}}', blogListHtml);
  
  const blogOutputDir = path.join(config.outputDir, 'blog');
  if (!fs.existsSync(blogOutputDir)) {
    fs.mkdirSync(blogOutputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(blogOutputDir, 'index.html'),
    finalHtml,
    'utf-8'
  );
  console.log('Built: blog/index.html');
}

// Build blog posts
function buildBlogPosts() {
  if (!fs.existsSync(config.blogDir)) {
    return;
  }
  
  if (!fs.existsSync(path.join(config.outputDir, 'blog'))) {
    fs.mkdirSync(path.join(config.outputDir, 'blog'), { recursive: true });
  }
  
  const blogFiles = fs.readdirSync(config.blogDir)
    .filter(file => file.endsWith('.md'));
  
  blogFiles.forEach(file => {
    const inputPath = path.join(config.blogDir, file);
    const outputPath = path.join(config.outputDir, 'blog', file.replace('.md', '.html'));
    buildPage(inputPath, outputPath, 'page');
  });
}

// Build all pages
function buildPages() {
  const pageFiles = fs.readdirSync(config.pagesDir)
    .filter(file => file.endsWith('.md') && file !== 'index.md'); // Skip index.md - it's edited manually
  
  pageFiles.forEach(file => {
    const inputPath = path.join(config.pagesDir, file);
    const outputName = file.replace('.md', '.html');
    const outputPath = path.join(config.outputDir, outputName);
    buildPage(inputPath, outputPath, 'page');
  });
}

// Copy static assets
function copyAssets() {
  if (fs.existsSync('./assets')) {
    const assetsDest = path.join(config.outputDir, 'assets');
    if (!fs.existsSync(assetsDest)) {
      fs.mkdirSync(assetsDest, { recursive: true });
    }
    
    const copyRecursive = (src, dest) => {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    
    copyRecursive('./assets', assetsDest);
    console.log('Copied assets');
  }
}

// Main build function
function build() {
  console.log('Building site...');
  
  // Create necessary directories
  [config.contentDir, config.pagesDir, config.blogDir, config.templateDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  buildPages();
  buildBlogIndex();
  buildBlogPosts();
  copyAssets();
  
  console.log('Build complete!');
}

build();

