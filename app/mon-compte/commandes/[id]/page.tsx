import { SessionGuard } from '@/components/auth/SessionGuard';
import { AccountNavigation } from '@/components/account/AccountNavigation';
import { OrderDetailView } from '@/components/account/OrderDetailView';
export const metadata = { title: 'Détail de la commande' };
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) { return <SessionGuard><main className="account-shell"><div className="account-heading"><p className="eyebrow">ESPACE CLIENT</p><h1>Mon compte</h1></div><div className="account-layout"><AccountNavigation /><section className="account-content"><OrderDetailView id={(await params).id} /></section></div></main></SessionGuard>; }
