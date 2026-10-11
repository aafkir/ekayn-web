'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products, type Product } from '@/lib/products';
import { getMe } from '@/lib/api/endpoints';

export type CartLine = { productId: string; quantity: number; variant?: string };
export type CartConfirmation = { productId: string; quantity: number; variant?: string; opener?: HTMLElement };
type CartContextValue = { lines: CartLine[]; count: number; add: (productId: string, quantity?: number, variant?: string, opener?: HTMLElement) => void; confirmation: CartConfirmation | null; closeConfirmation: () => void; update: (productId: string, quantity: number) => void; remove: (productId: string) => void; clear: () => void; productLines: { product: Product; line: CartLine }[] };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ownerKey, setOwnerKey] = useState<string>();
  const [hydrated, setHydrated] = useState(false);
  const [confirmation, setConfirmation] = useState<CartConfirmation | null>(null);
  useEffect(() => {
    let active = true;
    const refreshOwner = async () => {
      let nextOwner = 'guest';
      try { const profile = await getMe(); nextOwner = `user:${profile.id}`; } catch { /* guest cart */ }
      if (active) { setHydrated(false); setOwnerKey(nextOwner); }
    };
    refreshOwner();
    window.addEventListener('ekayn-auth-changed', refreshOwner);
    return () => { active = false; window.removeEventListener('ekayn-auth-changed', refreshOwner); };
  }, []);
  useEffect(() => {
    if (!ownerKey) return;
    try {
      const saved = localStorage.getItem(`ekayn-cart:${ownerKey}`);
      const parsed = saved ? JSON.parse(saved) as Record<string, number> : {};
      setLines(Object.entries(parsed).map(([productId, quantity]) => ({ productId, quantity })));
    } catch { setLines([]); }
    setHydrated(true);
  }, [ownerKey]);
  useEffect(() => {
    if (!ownerKey || !hydrated) return;
    localStorage.setItem(`ekayn-cart:${ownerKey}`, JSON.stringify(Object.fromEntries(lines.map((line) => [line.productId, line.quantity]))));
  }, [hydrated, lines, ownerKey]);
  const value = useMemo(() => ({
    lines, count: lines.reduce((sum, line) => sum + line.quantity, 0),
    add: (productId: string, quantity = 1, variant?: string, opener?: HTMLElement) => { setLines((current) => { const existing = current.find((line) => line.productId === productId && line.variant === variant); if (existing) return current.map((line) => line === existing ? { ...line, quantity: Math.min(99, line.quantity + quantity) } : line); return [...current, { productId, quantity: Math.min(99, quantity), variant }]; }); setConfirmation({ productId, quantity, variant, opener }); },
    confirmation,
    closeConfirmation: () => setConfirmation(null),
    update: (productId: string, quantity: number) => setLines((current) => quantity > 0 ? current.map((line) => line.productId === productId ? { ...line, quantity: Math.min(99, quantity) } : line) : current.filter((line) => line.productId !== productId)),
    remove: (productId: string) => setLines((current) => current.filter((line) => line.productId !== productId)),
    clear: () => setLines([]),
    productLines: lines.flatMap((line) => { const product = products.find((item: Product) => item.id === line.productId); return product ? [{ product, line }] : []; }),
  }), [confirmation, lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }
