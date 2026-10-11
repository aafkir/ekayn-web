'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api/endpoints';
import { products } from '@/lib/products';
import type { OrderSummary } from '@/types/api';

const money = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const deliveryStatus = (value: string) => ({
  CONFIRMED: 'Livraison confirmée',
  PREPARING: 'En préparation',
  EXPEDIEE: 'Commande expédiée',
  SHIPPED: 'Commande expédiée',
  DELIVERED: 'Commande livrée',
  CANCELLED: 'Livraison annulée',
  REFUNDED: 'Commande remboursée',
}[value] ?? 'Livraison en attente');
const paymentStatus = (value: string) => ({
  UNPAID: 'Paiement en attente',
  PENDING: 'Paiement en attente',
  PAID: 'Paiement confirmé',
  FAILED: 'Paiement échoué',
  EXPIRED: 'Paiement expiré',
  CHECKOUT_FAILED: 'Paiement échoué',
  REFUNDED: 'Paiement remboursé',
  CANCELLED: 'Paiement annulé',
}[value] ?? 'Paiement en attente');

export function OrdersView() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders().then(setOrders).catch((reason) => setError(reason instanceof Error ? reason.message : 'Impossible de charger vos commandes.'));
  }, []);

  if (error) return <div className="orders-state orders-state-error" role="alert"><strong>Impossible de charger vos commandes.</strong><p>{error}</p></div>;
  if (!orders) return <div className="orders-state loading" role="status">Chargement de vos commandes…</div>;
  if (!orders.length) return <div className="orders-state empty-state"><p>Vous n’avez pas encore passé de commande.</p><Link className="text-button" href="/#collection">Découvrir la collection</Link></div>;

  return <div className="orders-list">{orders.map((order) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const firstItem = order.items[0];
    const productNames = order.items.slice(0, 2).map((item) => item.productName).join(', ');
    const moreItems = order.items.length > 2 ? ` +${order.items.length - 2}` : '';
    const paymentPending = ['UNPAID', 'PENDING'].includes(order.paymentStatus);
    return <article className="order-card" key={order.id}>
      <div className="order-card-top">
        <div><p className="order-number">Commande {order.orderNumber}</p><time className="muted" dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</time></div>
        <strong className="order-total">{money(order.total)}</strong>
      </div>
      <div className="order-card-main">
        {firstItem && <img className="order-thumbnail" src={products.find((product) => product.id === firstItem.productId)?.image ?? '/assets/logo.png'} alt={firstItem.productName} />}
        <div><p className="order-item-count">{itemCount} article{itemCount > 1 ? 's' : ''}</p><p className="order-item-names">{productNames}{moreItems}</p></div>
      </div>
      {paymentPending && <div className="order-payment-note"><strong>Paiement en attente</strong><span>Finalisez votre paiement pour confirmer votre commande.</span></div>}
      <div className="order-card-bottom">
        <div className="status-pair"><span className="tag payment">{paymentStatus(order.paymentStatus)}</span><span className="tag">{deliveryStatus(order.deliveryStatus)}</span></div>
        <Link className="outline-button" href={`/mon-compte/commandes/${order.id}`}>Voir la commande</Link>
      </div>
    </article>;
  })}</div>;
}
