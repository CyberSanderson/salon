import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', // Don't index the private user dashboard
    },
    sitemap: 'https://www.ariahdesk.com/sitemap.xml',
  }
}