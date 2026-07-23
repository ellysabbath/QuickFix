// src/utils/sitemap.ts

export function generateSitemap() {
  const baseUrl = 'https://garagenea.com';
  
  const pages = [
    '/',
    '/signup',
    '/login',
    '/verify-otp',
    '/dashboard',
    '/bookings',
    '/list',
    '/garages',
    '/my-location',
    '/payments',
    '/profile',
    '/requests',
    '/myrequest',
    '/map',
    '/contacts',
    '/settings',
    '/help',
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  pages.forEach((page) => {
    const lastmod = new Date().toISOString().split('T')[0];
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += '</urlset>';
  return sitemap;
}