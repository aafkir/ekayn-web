import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { ProductGallery } from '@/components/ProductGallery';
import { AddToCartButton } from '@/components/AddToCartButton';
import Link from 'next/link';
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = products.find((item) => item.slug === slug); return { title: product?.name ?? 'Produit', description: product?.shortDescription ?? product?.description }; }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const product = products.find((item) => item.slug === slug); if (!product) notFound(); return <main className="page-wrap product-page"><div className="product-detail"><ProductGallery product={product} /><div className="product-detail-copy"><h1>{product.name}</h1><p className="description">{product.description}</p><p className="price">{(product.priceCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p><AddToCartButton productId={product.id} /><Link className="product-question" href={`/contact?produit=${product.slug}`}>Une question sur ce bijou ? <span>↗</span></Link></div></div></main>; }
