'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrder } from '@/lib/api/endpoints';
import type { OrderDetail } from '@/types/api';
import { products } from '@/lib/products';

const money = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const deliveryStatus = (value: string) => ({ CONFIRMED: 'Confirmée', PREPARING: 'En préparation', EXPEDIEE: 'Expédiée', SHIPPED: 'Expédiée', DELIVERED: 'Livrée', CANCELLED: 'Annulée', REFUNDED: 'Remboursée' }[value] ?? 'En attente');
const paymentStatus = (value: string) => ({ UNPAID: 'Paiement en attente', PENDING: 'Paiement en attente', PAID: 'Paiement confirmé', FAILED: 'Paiement échoué', EXPIRED: 'Paiement expiré', CHECKOUT_FAILED: 'Paiement échoué', REFUNDED: 'Paiement remboursé', CANCELLED: 'Paiement annulé' }[value] ?? 'Paiement en attente');

export function OrderDetailView({ id }: { id: string }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { getOrder(id).then(setOrder).catch((e) => setError(e instanceof Error ? e.message : 'Commande inaccessible.')); }, [id]);
  if (error) return <p className="form-message error" role="alert">{error}</p>;
  if (!order) return <p className="loading">Chargement de la commande…</p>;
  const steps = ['CONFIRMED', 'PREPARING', 'EXPEDIEE', 'DELIVERED'];
  const currentDelivery = order.deliveryStatus === 'SHIPPED' ? 'EXPEDIEE' : order.deliveryStatus;
  const rawAddress = order.shippingAddressSnapshot || [order.shippingName, order.shippingLine1, order.shippingLine2, `${order.shippingPostalCode} ${order.shippingCity}`, order.shippingCountry].filter(Boolean).join('\n');
  const addressLines = rawAddress.split('\n').map((line) => line.trim()).filter((line, index, all) => Boolean(line) && all.indexOf(line) === index);
  return <div className="order-detail"><Link className="text-button" href="/mon-compte/commandes">← Toutes mes commandes</Link><h2>Commande {order.orderNumber}</h2><p className="muted">Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p><div className="detail-grid"><div><h4>Articles</h4>{order.items.map((item) => <div className="detail-item" key={`${item.productId}-${item.variant}`}><img src={products.find((p) => p.id === item.productId)?.image ?? '/assets/logo.png'} alt={item.productName} /><div><strong>{item.productName}</strong><p className="muted">{item.variant ? `${item.variant} · ` : ''}Quantité : {item.quantity}<br />Prix conservé : {money(item.unitPrice)}</p></div><strong>{money(item.lineTotal)}</strong></div>)}</div><div><h4>Livraison</h4><p><strong>{order.shippingMethodLabel}</strong><br /><span className="tag">{deliveryStatus(order.deliveryStatus)}</span></p><p className="muted">{order.shippingCost === 0 ? 'Livraison offerte' : `Frais : ${money(order.shippingCost)}`}</p><address className="muted shipping-address">{addressLines.map((line) => <span key={line}>{line}</span>)}</address>{!['CANCELLED', 'REFUNDED'].includes(order.deliveryStatus) && <ol className="tracking">{steps.map((step) => <li className={currentDelivery === step ? 'active' : ''} key={step}>{deliveryStatus(step)}</li>)}</ol>}</div><div><h4>Paiement</h4><p><span className="tag payment">{paymentStatus(order.paymentStatus)}</span></p>{['UNPAID', 'PENDING'].includes(order.paymentStatus) && <p className="payment-pending">Paiement en attente — finalisez votre paiement pour confirmer votre commande.</p>}<div className="order-totals"><p>Sous-total : {money(order.subtotal)}</p><p>{order.shippingCost === 0 ? 'Livraison offerte' : `Livraison : ${money(order.shippingCost)}`}</p><strong>Total de la commande : {money(order.total)}</strong></div></div></div></div>;
}
