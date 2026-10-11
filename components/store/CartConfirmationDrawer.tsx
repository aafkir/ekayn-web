'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/products';
import { useCart } from './cart-context';

const euros = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value / 100);

export function CartConfirmationDrawer() {
  const router = useRouter();
  const { confirmation, closeConfirmation } = useCart();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!confirmation) return;
    openerRef.current = confirmation.opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeConfirmation();
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => openerRef.current?.focus());
    };
  }, [confirmation, closeConfirmation]);

  if (!confirmation) return null;
  const product = products.find((item) => item.id === confirmation.productId);
  if (!product) return null;

  function goToCart() {
    closeConfirmation();
    router.push('/panier');
  }

  return <div className="cart-confirmation-layer" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) closeConfirmation(); }}>
    <aside className="cart-confirmation-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="cart-confirmation-title" onClick={(event) => event.stopPropagation()}>
      <div className="cart-confirmation-head">
        <h2 id="cart-confirmation-title" tabIndex={-1}>C’est ajouté à votre panier !</h2>
        <button ref={closeButtonRef} className="icon-button cart-confirmation-close" type="button" onClick={closeConfirmation} aria-label="Fermer la confirmation">×</button>
      </div>
      <div className="cart-confirmation-product">
        <img src={product.image} alt={product.alt} />
        <div>
          <h3>{product.name}</h3>
          {confirmation.variant && <p>Variante : {confirmation.variant}</p>}
          <p>Quantité : {confirmation.quantity}</p>
          <strong>{euros(product.priceCents * confirmation.quantity)}</strong>
        </div>
      </div>
      <div className="cart-confirmation-actions">
        <button className="primary" type="button" onClick={goToCart}>Voir mon panier</button>
        <button className="cart-confirmation-continue" type="button" onClick={closeConfirmation}>Continuer mes achats</button>
      </div>
    </aside>
  </div>;
}
