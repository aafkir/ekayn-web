import { SessionGuard } from '@/components/auth/SessionGuard';
import { AccountNavigation } from '@/components/account/AccountNavigation';
import { OrdersView } from '@/components/account/OrdersView';
export const metadata = { title: 'Mes commandes' };
export default function OrdersPage() { return <SessionGuard><main className="account-shell"><div className="account-heading"><p className="eyebrow">ESPACE CLIENT</p><h1>Mon compte</h1></div><div className="account-layout"><AccountNavigation /><section className="account-content"><h2>Mes commandes</h2><OrdersView /></section></div></main></SessionGuard>; }
