import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
export default function sitemap(): MetadataRoute.Sitemap { const base = 'https://ekayn.com'; return [{ url: base, changeFrequency: 'weekly', priority: 1 }, ...products.map((product) => ({ url: `${base}/produits/${product.slug}`, changeFrequency: 'monthly' as const, priority: .8 })), ...['contact', 'livraison-et-retours', 'connexion', 'inscription'].map((path) => ({ url: `${base}/${path}`, changeFrequency: 'monthly' as const, priority: .5 }))]; }
