'use client';
import { useState } from 'react';
import type { Product } from '@/lib/products';
export function ProductGallery({ product }: { product: Product }) { const [selected, setSelected] = useState(product.images[0]); return <div><div className="product-gallery-main"><img src={selected.src} alt={selected.alt} /></div><div className="product-thumbs" aria-label="Images du produit">{product.images.map((image) => <button className={selected.src === image.src ? 'active' : ''} key={image.src} onClick={() => setSelected(image)} aria-label={`Afficher ${image.alt}`}><img src={image.src} alt="" /></button>)}</div></div>; }
