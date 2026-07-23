// src/hooks/useSEO.ts

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeSEO, defaultSEO } from '../utils/SEO';
import type { SEOProps } from '../utils/SEO';

export function useSEO(customSEO?: Partial<SEOProps>) {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Get SEO data for current route or use default
    const routeData = routeSEO[path] || routeSEO['/'];
    const seoData: SEOProps = {
      ...defaultSEO,
      ...routeData,
      ...customSEO,
    };

    // Update title
    document.title = seoData.title;

    // Update or create meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      isProperty: boolean = false
    ) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords || defaultSEO.keywords || '');

    // Open Graph tags (for social media sharing)
    updateMetaTag('og:title', seoData.title, true);
    updateMetaTag('og:description', seoData.description, true);
    updateMetaTag('og:type', seoData.type || 'website', true);
    updateMetaTag('og:image', seoData.image || defaultSEO.image || '', true);
    updateMetaTag('og:url', seoData.url || defaultSEO.url || '', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    updateMetaTag('twitter:image', seoData.image || defaultSEO.image || '');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.url || defaultSEO.url || '');

    // Add JSON-LD structured data (Organization)
    const orgData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Fundi Fasta',
      url: 'https://garagenea.com',
      logo: 'https://garagenea.com/logo.png',
      description: 'Motor vehicle solutions platform connecting mechanics and customers.',
      sameAs: [
        'https://facebook.com/fundifasta',
        'https://twitter.com/fundifasta',
        'https://instagram.com/fundifasta',
      ],
    };

    let script = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(orgData);

    // Cleanup function (optional)
    return () => {
      // No cleanup needed for this implementation
    };
  }, [path, customSEO]);
}