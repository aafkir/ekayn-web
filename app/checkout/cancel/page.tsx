import Link from 'next/link';
export const metadata = { title: 'Paiement annulé' };
export default function CancelPage() { return <main className="payment-result"><p className="eyebrow">PAIEMENT ANNULÉ</p><h1>Votre panier est conservé.</h1><p>Le paiement n’a pas été finalisé. Vous pouvez revenir au panier et réessayer quand vous le souhaitez.</p><Link className="primary" href="/panier">Retour au panier <span>↗</span></Link></main>; }
