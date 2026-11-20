import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fullTitle, OG_IMAGE, routeMeta } from '../src/seo/routes.js'
import { programCategories } from '../src/data/content.js'

// After `vite build`, writes one HTML file per public route with that page's
// own <title>, description, canonical and Open Graph tags, so WhatsApp and
// search engines see the right preview without running JavaScript.
// Also writes 404.html (served by Vercel for unknown URLs, with a real 404
// status) and sitemap.xml.

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender-meta: tag not found in index.html: ${pattern}`)
  return html.replace(pattern, replacement)
}

function renderHead(template, { title, description, url, siteUrl, noindex = false }) {
  const t = escapeAttr(title)
  const d = escapeAttr(description)
  const u = escapeAttr(url)
  let html = template
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`)
  html = setTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${d}" />`)
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${u}" />`)
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}" />`)
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}" />`)
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${u}" />`)
  html = setTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${siteUrl}${OG_IMAGE}" />`)
  html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${t}" />`)
  html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${d}" />`)
  html = setTag(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${siteUrl}${OG_IMAGE}" />`)
  if (noindex) {
    html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex" />\n    <meta name="theme-color"')
  }
  return html
}

export default function prerenderMetaPlugin() {
  let outDir = 'dist'
  let siteUrl = 'https://voiceforunheard.vercel.app'

  return {
    name: 'prerender-meta',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      siteUrl = (config.env.VITE_SITE_URL || siteUrl).replace(/\/$/, '')
    },
    closeBundle() {
      const indexPath = join(outDir, 'index.html')
      const template = readFileSync(indexPath, 'utf8')

      const pages = Object.entries(routeMeta).map(([path, meta]) => ({
        path,
        title: fullTitle(meta.en.title),
        description: meta.en.description,
      }))
      for (const program of programCategories) {
        pages.push({
          path: `/programs/${program.id}`,
          title: fullTitle(program.title),
          description: program.summary,
        })
      }

      for (const page of pages) {
        const url = `${siteUrl}${page.path === '/' ? '/' : page.path}`
        const html = renderHead(template, { ...page, url, siteUrl })
        // With "cleanUrls" in vercel.json, /statistics is served from statistics.html.
        const file = page.path === '/' ? indexPath : join(outDir, `${page.path.slice(1)}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }

      writeFileSync(
        join(outDir, '404.html'),
        renderHead(template, {
          title: fullTitle('Page not found'),
          description: 'The page you are looking for does not exist or has moved.',
          url: `${siteUrl}/404`,
          siteUrl,
          noindex: true,
        }),
      )

      const today = new Date().toISOString().slice(0, 10)
      const urls = pages
        .map((p) => `  <url><loc>${siteUrl}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )

      writeFileSync(
        join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /portal/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      )

      this.info?.(`prerender-meta: wrote ${pages.length} pages, 404.html, sitemap.xml, robots.txt`)
    },
  }
}
