import axios from 'axios';
import * as cheerio from 'cheerio';

const WORDPRESS_URL = 'http://localhost/tiles-trader';
const WP_API_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;

function aggressiveUrlReplace(content) {
  if (!content) return '';
  const wordpressUrlRegex = new RegExp(WORDPRESS_URL.replace(/\//g, '\\/'), 'g');
  const ipUrlRegex = /http:\/\/167\.86\.120\.153\/tiles-trader/g; // Catching the IP address from your JSON

  // Replace both localhost and the IP address URL with a relative path
  let updatedContent = content.replace(wordpressUrlRegex, '');
  updatedContent = updatedContent.replace(ipUrlRegex, '');
  
  return updatedContent;
}

export async function getFullPageHTML(slug) {
  try {
    const url = `${WORDPRESS_URL}/${slug === 'home' ? '' : slug}`;
    const response = await axios.get(url);
    let html = response.data;
    
    // Perform URL replacement on the entire HTML before parsing
    html = aggressiveUrlReplace(html);
    
    const $ = cheerio.load(html);

    const bodyContent = $('#page').html();
    const title = $('head title').text();
    const bodyClasses = $('body').attr('class');

    const styleLinks = [];
    $('link[rel="stylesheet"]').each((i, el) => {
      let href = $(el).attr('href');
      // Re-add the base URL for external stylesheets if they became relative
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
        // Re-add base URL for scripts if they became relative
        if (!absoluteSrc.startsWith('http')) {
          absoluteSrc = `${WORDPRESS_URL}${absoluteSrc}`;
        }
        scripts.push({ type: 'src', content: absoluteSrc });
      } else {
        const inlineContent = $(el).html();
        if (inlineContent && (inlineContent.includes('elementorFrontendConfig') || inlineContent.includes('webpackJsonp'))) {
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

// --- NEW Universal Slug Fetcher ---
export async function getAllSlugs() {
  try {
    const [pages, posts] = await Promise.all([
      axios.get(`${WP_API_URL}/pages`, { params: { per_page: 100, _fields: 'slug' } }),
      axios.get(`${WP_API_URL}/posts`, { params: { per_page: 100, _fields: 'slug' } })
      // You can add other post types here, e.g., portfolios, collections
      // axios.get(`${WP_API_URL}/portfolio`, { params: { per_page: 100, _fields: 'slug' } })
    ]);

    const pageSlugs = pages.data.map(p => p.slug);
    const postSlugs = posts.data.map(p => p.slug);
    
    const allSlugs = [...pageSlugs, ...postSlugs];
    allSlugs.push('home'); // Add the homepage
    
    console.log('Found slugs:', allSlugs);
    return allSlugs;

  } catch (error) {
    console.error('Error fetching all slugs:', error);
    return ['home']; // Default to at least the homepage on error
  }
}