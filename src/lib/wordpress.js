import axios from 'axios';
import * as cheerio from 'cheerio';

const WORDPRESS_URL = 'http://localhost/tiles-trader';
const WP_API_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;

export async function getFullPageHTML(slug) {
  try {
    const url = `${WORDPRESS_URL}/${slug === 'home' ? '' : slug}`;
    const response = await axios.get(url);
    let html = response.data;
    
    // 1. Replace the full absolute URL (e.g., http://localhost/tiles-trader)
    html = html.replace(new RegExp(WORDPRESS_URL, 'g'), '');
    
    // 2. NEW: Replace the relative subdirectory path in links
    html = html.replace(/href="\/tiles-trader/g, 'href="');

    const $ = cheerio.load(html);

    const bodyContent = $('#page').html();
    const title = $('head title').text();
    const bodyClasses = $('body').attr('class');

    const styleLinks = [];
    $('link[rel="stylesheet"]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !href.startsWith('http')) {
        href = `${WORDPRESS_URL}${href}`;
      }
      styleLinks.push(href);
    });

    const scripts = [];
    $('script').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        let absoluteSrc = src;
        if (!absoluteSrc.startsWith('http')) {
          absoluteSrc = `${WORDPRESS_URL}${absoluteSrc}`;
        }
        scripts.push({ type: 'src', content: absoluteSrc });
      } else {
        const inlineContent = $(el).html();
        if (inlineContent && inlineContent.includes('elementorFrontendConfig')) {
          scripts.push({ type: 'inline', content: inlineContent });
        }
      }
    });

    return { title, bodyContent, bodyClasses, styleLinks, scripts };
  } catch (error) {
    console.error(`Error fetching page '${slug}':`, error.message);
    return null;
  }
}

export async function getAllSlugs() {
  try {
    const [pages, posts, portfolios, categories] = await Promise.all([
      axios.get(`${WP_API_URL}/pages`, { params: { per_page: 100, _fields: 'slug' } }),
      axios.get(`${WP_API_URL}/posts`, { params: { per_page: 100, _fields: 'slug' } }),
      axios.get(`${WP_API_URL}/portfolio`, { params: { per_page: 100, _fields: 'slug' } }),
      axios.get(`${WP_API_URL}/categories`, { params: { per_page: 100, _fields: 'slug' } })
    ]);

    const pageSlugs = pages.data.map(p => p.slug);
    const postSlugs = posts.data.map(p => p.slug);
    const portfolioSlugs = portfolios.data.map(p => `portfolio/${p.slug}`);
    const categorySlugs = categories.data.map(c => `category/${c.slug}`);

    let allSlugs = [...pageSlugs, ...postSlugs, ...portfolioSlugs, ...categorySlugs];
    allSlugs.push('home');
    
    const validSlugs = allSlugs.filter(Boolean);
    
    return validSlugs;

  } catch (error) {
    console.error('Error fetching all slugs:', error);
    return ['home'];
  }
}