// scripts/generate-sitemap.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your website URL
const BASE_URL = 'https://garagenea.com';

// List all your pages
const pages = [
  // Public Pages - High Priority
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/signup', priority: '0.9', changefreq: 'weekly' },
  { url: '/login', priority: '0.9', changefreq: 'weekly' },
  { url: '/verify-otp', priority: '0.8', changefreq: 'weekly' },
  { url: '/contacts', priority: '0.8', changefreq: 'weekly' },
  { url: '/help', priority: '0.7', changefreq: 'weekly' },
  
  // Service Pages - Medium Priority
  { url: '/garages', priority: '0.9', changefreq: 'daily' },
  { url: '/list', priority: '0.9', changefreq: 'daily' },
  { url: '/map', priority: '0.8', changefreq: 'daily' },
  { url: '/my-location', priority: '0.8', changefreq: 'daily' },
  { url: '/requests', priority: '0.7', changefreq: 'daily' },
  { url: '/myrequest', priority: '0.7', changefreq: 'daily' },
  { url: '/bookings', priority: '0.7', changefreq: 'daily' },
  
  // User Pages - Lower Priority
  { url: '/dashboard', priority: '0.5', changefreq: 'daily' },
  { url: '/profile', priority: '0.4', changefreq: 'weekly' },
  { url: '/settings', priority: '0.3', changefreq: 'weekly' },
  { url: '/payments', priority: '0.3', changefreq: 'weekly' },
];

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach((page) => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Write sitemap to public folder
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    
    // Ensure the public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    console.log(' Sitemap generated successfully!');
    console.log(` Total pages: ${pages.length}`);
    console.log(` Location: ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error.message);
  }
}

writeSitemap();