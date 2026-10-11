'use client';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './store/cart-context';

export function AddToCartButton({ productId }: { productId: string }) {
  const { add } = useCart();
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  async function addToCart(event: React.MouseEvent<HTMLButtonElement>) {
    if (state === 'loading') return;
    const opener = event.currentTarget;
    setState('loading');
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    add(productId, 1, undefined, opener);
    setState('success');
    resetTimer.current = setTimeout(() => setState('idle'), 1800);
  }

  const label = state === 'loading' ? 'Ajout…' : state === 'success' ? 'Ajouté au panier' : 'Ajouter au panier';
  return <div className="product-add-action"><button className="primary product-add-button" type="button" onClick={addToCart} disabled={state === 'loading'} aria-live="polite">{label} <span>{state === 'success' ? '✓' : '+'}</span></button></div>;
}
