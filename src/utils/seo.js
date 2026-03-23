const DEFAULT_TITLE = 'Herma';
const DEFAULT_DESCRIPTION = 'One API for every AI model. Herma routes your queries to the best model for the job — unified access, smart routing, and full cost visibility.';
const DEFAULT_IMAGE = 'https://hermaai.com/og-default.png';

/**
 * Sets page title, meta description, OpenGraph, and Twitter Card tags.
 *
 * @param {string} title   - Page-specific title (appended with " | Herma")
 * @param {string} description - Meta description
 * @param {object} options - Optional: { url, image, type }
 */
export function setPageMeta(title, description, options = {}) {
  const fullTitle = title ? `${title} | Herma` : DEFAULT_TITLE;
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
