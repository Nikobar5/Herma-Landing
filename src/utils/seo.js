const DEFAULT_TITLE = 'Herma | AI Model Router | Save 60-90% on AI Costs';
// SEO: align with index.html meta description (og-default.png was a bug — og-image.png is the correct file)
const DEFAULT_DESCRIPTION = 'Herma AI is an intelligent LLM router that routes API calls to the optimal model for each task. OpenAI-compatible API with 60-90% cost savings versus frontier models. Free $1 to start.';
const DEFAULT_IMAGE = 'https://hermaai.com/og-image.png';

/**
 * Sets page title, meta description, OpenGraph, and Twitter Card tags.
 *
 * @param {string} title   - Page-specific title (appended with " | Herma")
 * @param {string} description - Meta description
 * @param {object} options - Optional: { url, image, type }
 */
export function setPageMeta(title, description, options = {}) {
  const fullTitle = title ? `Herma | ${title}` : DEFAULT_TITLE;
  document.title = fullTitle;

  const url = options.url || window.location.href;
  const image = options.image || DEFAULT_IMAGE;

  const tags = {
    'description': description || '',
    'og:title': fullTitle,
    'og:description': description || '',
    'og:url': url,
    'og:image': image,
    'og:type': options.type || 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': fullTitle,
    'twitter:description': description || '',
    'twitter:image': image,
  };

  Object.entries(tags).forEach(([name, content]) => {
    const isOg = name.startsWith('og:') || name.startsWith('twitter:');
    const attr = isOg ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // SEO: inject canonical link tag to prevent duplicate content penalties
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

/**
 * Resets OG / Twitter tags to site-wide defaults.
 * Call this on component unmount so stale page-specific tags don't persist.
 */
export function resetPageMeta() {
  setPageMeta(null, DEFAULT_DESCRIPTION);
}

/**
 * Injects or updates a JSON-LD structured data script tag in <head>.
 *
 * @param {string} id   - Unique ID for the script element (allows update/removal)
 * @param {object} data - The structured data object to serialize as JSON-LD
 */
export function setStructuredData(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Removes a JSON-LD structured data script tag by ID.
 *
 * @param {string} id - The ID of the script element to remove
 */
export function removeStructuredData(id) {
  const script = document.getElementById(id);
  if (script) script.remove();
}
