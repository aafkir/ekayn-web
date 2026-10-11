'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckout, getAddresses, getCheckoutQuote } from '@/lib/api/endpoints';
import type { Address, ShippingQuote } from '@/types/api';
import { useCart } from './cart-context';

const euros = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { lines, productLines, update, remove } = useCart();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState('');
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const idempotencyKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    getAddresses().then((values) => {
      setAddresses(values);
      setAddressId((current) => current || values.find((value) => value.defaultAddress)?.id || values[0]?.id || '');
    }).catch(() => setFeedback('Connectez-vous pour choisir une adresse de livraison.'));
  }, [open]);

  useEffect(() => {
    if (!productLines.length || !addressId) return;
    setFeedback('');
    getCheckoutQuote(productLines.map(({ product, line }) => ({
      productId: product.id,
      quantity: line.quantity,
      ...(line.variant ? { variant: line.variant } : {}),
    })), addressId).then(setQuote).catch((error) => {
      setQuote(null);
      setFeedback(error instanceof Error ? error.message : 'Le total de livraison est indisponible.');
    });
  }, [addressId, productLines]);

  async function checkout() {
    if (loading) return;
    if (!addressId) {
      onClose();
      router.push('/connexion?returnTo=/panier');
      return;
    }
    if (!quote) {
      setFeedback('Le total doit être calculé avant le paiement.');
      return;
    }
    setLoading(true);
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      const result = await createCheckout(productLines.map(({ product, line }) => ({
        productId: product.id,
        quantity: line.quantity,
        ...(line.variant ? { variant: line.variant } : {}),
      })), addressId, idempotencyKey.current);
      sessionStorage.setItem('ekayn-pending-checkout', JSON.stringify({ idempotencyKey: idempotencyKey.current, cart: lines }));
      onClose();
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      idempotencyKey.current = undefined;
      setFeedback(error instanceof Error ? error.message : 'Le paiement est indisponible pour le moment.');
      setLoading(false);
    }
  }

  return <div className={`cart-drawer-layer ${open ? 'is-open' : ''}`} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
  <aside className={`cart-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Votre panier" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-head">
      <div><p className="eyebrow">VOTRE SÉLECTION</p><h2>Mon panier</h2></div>
      <button className="icon-button" onClick={onClose} aria-label="Fermer le panier">×</button>
    </div>
    {!productLines.length ? <div className="cart-empty"><p>Votre panier est vide.</p><Link className="text-button" href="/#collection" onClick={onClose}>Découvrir la collection</Link></div> : <>
      <div className="cart-lines">
        {productLines.map(({ product, line }) => <article className="cart-line" key={`${product.id}-${line.variant ?? ''}`}>
          <img src={product.image} alt={product.alt} />
          <div className="cart-line-content">
            <div className="cart-line-heading"><h3>{product.name}</h3><strong>{euros(product.priceCents / 100)}</strong></div>
            <div className="cart-line-actions">
              <div className="quantity" aria-label={`Quantité de ${product.name}`}>
                <button onClick={() => update(product.id, line.quantity - 1)} aria-label={`Diminuer ${product.name}`}>−</button>
                <span>{line.quantity}</span>
                <button onClick={() => update(product.id, line.quantity + 1)} aria-label={`Augmenter ${product.name}`}>+</button>
              </div>
              <button className="remove" onClick={() => remove(product.id)}>Supprimer</button>
            </div>
          </div>
        </article>)}
      </div>
      <section className="shipping-choice" aria-labelledby="shipping-title">
        <h3 id="shipping-title">Livraison</h3>
        <p className="shipping-summary"><strong>{quote?.shippingMethodLabel ?? 'Livraison à domicile avec suivi'}</strong><span>{quote ? (quote.shippingCost === 0 ? 'Livraison offerte' : euros(quote.shippingCost)) : 'Calculée selon l’adresse'}</span></p>
        <label className="address-select">Adresse de livraison<select value={addressId} onChange={(event) => setAddressId(event.target.value)}><option value="">Choisir une adresse</option>{addresses.map((address) => <option value={address.id} key={address.id}>{address.label} · {address.postalCode} {address.city}</option>)}</select></label>
      </section>
      <div className="cart-summary-server">
        {quote ? <><div><span>Sous-total</span><strong>{euros(quote.subtotal)}</strong></div><div><span>Livraison</span><strong>{quote.shippingCost === 0 ? 'Offerte' : euros(quote.shippingCost)}</strong></div><div className="summary-total"><span>Total</span><strong>{euros(quote.total)}</strong></div></> : <p className="loading">Calcul du total de livraison…</p>}
      </div>
      <p className="form-message error cart-feedback" role="alert">{feedback}</p>
      <div className="cart-checkout-footer"><button className="primary checkout-button" onClick={checkout} disabled={loading || !quote}>{loading ? 'Préparation du paiement…' : 'Passer au paiement'} <span>↗</span></button></div>
    </>}
  </aside>
  </div>;
}
